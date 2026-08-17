import { Injectable } from '@nestjs/common';
import { createClient } from '@supabase/supabase-js';

@Injectable()
export class UploadsService {
  private supabase = createClient(
    process.env.SUPABASE_URL || '',
    process.env.SUPABASE_SERVICE_ROLE_KEY || '',
  );

  async uploadResume(file: any, studentId: string) {
    const fileName = `${studentId}-resume-${Date.now()}.pdf`;
    const { data, error } = await this.supabase.storage
      .from('resumes')
      .upload(fileName, file.buffer, { contentType: 'application/pdf', upsert: true });

    if (error) throw new Error(error.message);
    const { data: urlData } = this.supabase.storage.from('resumes').getPublicUrl(fileName);
    return { url: urlData.publicUrl, path: fileName };
  }

  async getSignedUrl(path: string) {
    const { data, error } = await this.supabase.storage.from('resumes').createSignedUrl(path, 3600);
    if (error) throw new Error(error.message);
    return { signedUrl: data.signedUrl };
  }
}

// models/ResumeModel.ts
import { supabase } from '../config/supabase.js'

interface Resume {
  id: string
  user_id: string
  file_url: string
  file_name: string
  is_default: boolean
  uploaded_at: Date
}

// Raw từ DB (snake_case, timestamp là string)
type DBResume = {
  id: string
  user_id: string
  file_url: string
  file_name: string
  is_default: boolean
  uploaded_at: string
}

function mapDB(row: DBResume): Resume {
  return {
    ...row,
    uploaded_at: new Date(row.uploaded_at),
  }
}

export class ResumeModel {
  static async findAll(): Promise<Resume[]> {
    const { data, error } = await supabase
      .from('resumes')
      .select('id,user_id,file_url,file_name,is_default,uploaded_at')
      .returns<DBResume[]>()

    if (error) throw error
    return (data ?? []).map(mapDB)
  }

  static async findById(id: string): Promise<Resume | null> {
    const { data, error } = await supabase
      .from('resumes')
      .select('id,user_id,file_url,file_name,is_default,uploaded_at')
      .eq('id', id)
      .maybeSingle<DBResume>()

    if (error) throw error
    return data ? mapDB(data) : null
  }

  static async findByUserId(userId: string): Promise<Resume[]> {
    const { data, error } = await supabase
      .from('resumes')
      .select('id,user_id,file_url,file_name,is_default,uploaded_at')
      .eq('user_id', userId)
      .order('uploaded_at', { ascending: false })
      .returns<DBResume[]>()

    if (error) throw error
    return (data ?? []).map(mapDB)
  }

  static async uploadResume(
    userId: string,
    fileUrl: string,
    fileName: string,
    isDefault: boolean
  ): Promise<Resume> {
    if (isDefault) {
      const { error: unsetErr } = await supabase
        .from('resumes')
        .update({ is_default: false })
        .eq('user_id', userId)

      if (unsetErr) throw unsetErr
    }

    const payload = {
      user_id: userId,
      file_url: fileUrl,
      file_name: fileName,
      is_default: isDefault,
      uploaded_at: new Date().toISOString(),
    }

    const { data, error } = await supabase
      .from('resumes')
      .insert([payload])
      .select('id,user_id,file_url,file_name,is_default,uploaded_at')
      .single<DBResume>()

    if (error) throw error
    return mapDB(data)
  }

  static async setDefaultResume(userId: string, resumeId: string): Promise<void> {
    const { error: unsetErr } = await supabase
      .from('resumes')
      .update({ is_default: false })
      .eq('user_id', userId)

    if (unsetErr) throw unsetErr

    const { error: setErr } = await supabase
      .from('resumes')
      .update({ is_default: true })
      .eq('id', resumeId)
      .eq('user_id', userId)

    if (setErr) throw setErr
  }

  static async deleteResume(userId: string, resumeId: string): Promise<void> {
    const { error } = await supabase
      .from('resumes')
      .delete()
      .eq('id', resumeId)
      .eq('user_id', userId)

    if (error) throw error
  }
}

export interface Profile {
  id: string
  gender: 'male' | 'female' | null
  birth_year: number | null
  created_at: string
}

export interface BloodTest {
  id: string
  user_id: string
  test_date: string
  notes: string | null
  file_url: string | null
  ai_summary: string | null
  created_at: string
}

export interface BloodTestResult {
  id: string
  test_id: string
  marker_key: string
  value: number
  unit: string
  created_at: string
}

export interface ReferenceRange {
  marker_key: string
  gender: 'male' | 'female' | 'all'
  min_value: number
  max_value: number
  unit: string
}

export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: Profile
        Insert: Omit<Profile, 'created_at'>
        Update: Partial<Omit<Profile, 'id' | 'created_at'>>
      }
      blood_tests: {
        Row: BloodTest
        Insert: Omit<BloodTest, 'id' | 'created_at'>
        Update: Partial<Omit<BloodTest, 'id' | 'user_id' | 'created_at'>>
      }
      blood_test_results: {
        Row: BloodTestResult
        Insert: Omit<BloodTestResult, 'id' | 'created_at'>
        Update: Partial<Omit<BloodTestResult, 'id' | 'test_id' | 'created_at'>>
      }
      reference_ranges: {
        Row: ReferenceRange
        Insert: ReferenceRange
        Update: Partial<ReferenceRange>
      }
    }
  }
}

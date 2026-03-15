import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { TestEntryForm } from '@/components/blood-test/test-entry-form'
import { FileUploadTab } from '@/components/blood-test/file-upload-tab'

type Tab = 'manual' | 'upload'

export function NewTestPage() {
  const navigate = useNavigate()
  const [activeTab, setActiveTab] = useState<Tab>('manual')

  const handleSuccess = () => {
    navigate('/dashboard')
  }

  return (
    <div className="mx-auto max-w-2xl space-y-6 px-4 py-6 sm:p-8">
      <h1 className="text-2xl font-bold text-dark">Naujas tyrimas</h1>

      <div className="flex border-b border-neutral">
        <button
          type="button"
          onClick={() => setActiveTab('manual')}
          className={`px-4 py-2 text-sm font-medium transition-colors ${
            activeTab === 'manual'
              ? 'border-b-2 border-primary text-primary'
              : 'text-neutral-dark hover:text-dark'
          }`}
        >
          Įvesti rankiniu būdu
        </button>
        <button
          type="button"
          onClick={() => setActiveTab('upload')}
          className={`px-4 py-2 text-sm font-medium transition-colors ${
            activeTab === 'upload'
              ? 'border-b-2 border-primary text-primary'
              : 'text-neutral-dark hover:text-dark'
          }`}
        >
          Įkelti failą
        </button>
      </div>

      {activeTab === 'manual' && <TestEntryForm onSuccess={handleSuccess} />}
      {activeTab === 'upload' && <FileUploadTab />}
    </div>
  )
}

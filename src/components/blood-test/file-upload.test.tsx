import { describe, it, expect, vi } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { FileUpload } from './file-upload'

function createMockFile(name: string, size: number, type: string): File {
  const buffer = new ArrayBuffer(size)
  return new File([buffer], name, { type })
}

describe('FileUpload', () => {
  it('renders upload zone with instructions', () => {
    render(<FileUpload onFileSelect={vi.fn()} />)
    expect(screen.getByText('Vilkite failą čia arba paspauskite')).toBeInTheDocument()
    expect(screen.getByText(/PDF, JPG arba PNG/)).toBeInTheDocument()
  })

  it('renders hidden file input', () => {
    render(<FileUpload onFileSelect={vi.fn()} />)
    expect(screen.getByLabelText('Pasirinkti failą')).toBeInTheDocument()
  })

  it('calls onFileSelect with valid PDF file', async () => {
    const user = userEvent.setup()
    const onFileSelect = vi.fn()
    render(<FileUpload onFileSelect={onFileSelect} />)

    const file = createMockFile('test.pdf', 1024, 'application/pdf')
    const input = screen.getByLabelText('Pasirinkti failą')
    await user.upload(input, file)

    expect(onFileSelect).toHaveBeenCalledWith(file)
  })

  it('calls onFileSelect with valid JPG file', async () => {
    const user = userEvent.setup()
    const onFileSelect = vi.fn()
    render(<FileUpload onFileSelect={onFileSelect} />)

    const file = createMockFile('photo.jpg', 2048, 'image/jpeg')
    const input = screen.getByLabelText('Pasirinkti failą')
    await user.upload(input, file)

    expect(onFileSelect).toHaveBeenCalledWith(file)
  })

  it('calls onFileSelect with valid PNG file', async () => {
    const user = userEvent.setup()
    const onFileSelect = vi.fn()
    render(<FileUpload onFileSelect={onFileSelect} />)

    const file = createMockFile('screenshot.png', 4096, 'image/png')
    const input = screen.getByLabelText('Pasirinkti failą')
    await user.upload(input, file)

    expect(onFileSelect).toHaveBeenCalledWith(file)
  })

  it('shows selected file name', async () => {
    const user = userEvent.setup()
    render(<FileUpload onFileSelect={vi.fn()} />)

    const file = createMockFile('tyrimas.pdf', 2 * 1024 * 1024, 'application/pdf')
    const input = screen.getByLabelText('Pasirinkti failą')
    await user.upload(input, file)

    expect(screen.getByText(/tyrimas\.pdf/)).toBeInTheDocument()
  })

  it('shows error for invalid file type', () => {
    const onFileSelect = vi.fn()
    render(<FileUpload onFileSelect={onFileSelect} />)

    const file = createMockFile('test.txt', 1024, 'text/plain')
    const input = screen.getByLabelText('Pasirinkti failą')
    fireEvent.change(input, { target: { files: [file] } })

    expect(screen.getByText(/Netinkamas failo formatas/)).toBeInTheDocument()
    expect(onFileSelect).not.toHaveBeenCalled()
  })

  it('shows error for oversized file', async () => {
    const user = userEvent.setup()
    const onFileSelect = vi.fn()
    render(<FileUpload onFileSelect={onFileSelect} maxSizeMB={1} />)

    const file = createMockFile('big.pdf', 2 * 1024 * 1024, 'application/pdf')
    const input = screen.getByLabelText('Pasirinkti failą')
    await user.upload(input, file)

    expect(screen.getByText(/Failas per didelis/)).toBeInTheDocument()
    expect(onFileSelect).not.toHaveBeenCalled()
  })

  it('shows uploading state', () => {
    render(<FileUpload onFileSelect={vi.fn()} isUploading />)
    expect(screen.getByText('Įkeliama...')).toBeInTheDocument()
  })

  it('handles drag over visual feedback', () => {
    render(<FileUpload onFileSelect={vi.fn()} />)
    const dropZone = screen.getByText('Vilkite failą čia arba paspauskite').closest('button')!

    fireEvent.dragOver(dropZone)
    expect(dropZone.className).toContain('border-primary')

    fireEvent.dragLeave(dropZone)
    expect(dropZone.className).toContain('border-neutral')
  })
})

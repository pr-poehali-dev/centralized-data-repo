import { useState } from 'react'
import { Button } from '@/components/ui/button'
import func2url from '../../../backend/func2url.json'

export default function ApplicationForm() {
  const [form, setForm] = useState({ name: '', phone: '', message: '' })
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setStatus('loading')
    try {
      const res = await fetch(func2url['send-application'], {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form)
      })
      if (res.ok) {
        setStatus('success')
        setForm({ name: '', phone: '', message: '' })
      } else {
        setStatus('error')
      }
    } catch {
      setStatus('error')
    }
  }

  if (status === 'success') {
    return (
      <div className="mt-8 bg-[#8BC34A]/20 border border-[#8BC34A]/50 rounded-xl p-6 max-w-md">
        <div className="text-[#8BC34A] font-semibold text-lg mb-1">Заявка отправлена!</div>
        <div className="text-neutral-300 text-sm">Наш специалист свяжется с вами в течение 30 минут.</div>
        <button
          className="mt-4 text-sm text-neutral-400 underline hover:text-white"
          onClick={() => setStatus('idle')}
        >
          Отправить ещё
        </button>
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit} className="mt-8 flex flex-col gap-3 max-w-md">
      <input
        type="text"
        placeholder="Ваше имя *"
        value={form.name}
        onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
        required
        className="bg-white/10 border border-white/20 rounded-xl px-4 py-3 text-white placeholder-neutral-500 focus:outline-none focus:border-[#8BC34A] transition-colors"
      />
      <input
        type="tel"
        placeholder="Телефон *"
        value={form.phone}
        onChange={e => setForm(f => ({ ...f, phone: e.target.value }))}
        required
        className="bg-white/10 border border-white/20 rounded-xl px-4 py-3 text-white placeholder-neutral-500 focus:outline-none focus:border-[#8BC34A] transition-colors"
      />
      <textarea
        placeholder="Опишите задачу (необязательно)"
        value={form.message}
        onChange={e => setForm(f => ({ ...f, message: e.target.value }))}
        rows={3}
        className="bg-white/10 border border-white/20 rounded-xl px-4 py-3 text-white placeholder-neutral-500 focus:outline-none focus:border-[#8BC34A] transition-colors resize-none"
      />
      {status === 'error' && (
        <div className="text-red-400 text-sm">Ошибка отправки. Попробуйте ещё раз.</div>
      )}
      <Button
        type="submit"
        disabled={status === 'loading'}
        size="lg"
        className="bg-[#8BC34A] hover:bg-[#7CB342] text-white font-semibold px-8 py-6 text-base rounded-xl transition-colors disabled:opacity-60"
      >
        {status === 'loading' ? 'Отправка...' : 'Оставить заявку'}
      </Button>
    </form>
  )
}

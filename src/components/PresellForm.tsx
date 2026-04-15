'use client';

import React, { useRef, useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Form, FormControl, FormField, FormItem, FormMessage } from '@/components/ui/form';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import {
  Package, Globe, ImageIcon, SlidersHorizontal,
  Sparkles, Eye, Upload, X, ChevronDown, Link as LinkIcon, Plus, AlertTriangle
} from 'lucide-react';

const formSchema = z.object({
  productName: z.string().min(2, 'Informe o nome do produto.'),
  productInfo: z.string().optional().or(z.literal('')),
  salesPageDescription: z.string().optional().or(z.literal('')),
  officialProductUrl: z.string().url('URL inválida.'),
  targetLanguage: z.string().min(1, 'Selecione um país.'),
  templateType: z.enum(['Lançamento', 'Robusta', 'Review', 'Cookie', 'Lista (Top 3/5)']),
  copyStyle: z.enum(['White Hat (Conservador)', 'Black Hat (Agressivo)']),
  buttonColor: z.string().regex(/^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/),
  targetUrl: z.string().url('Link de afiliado inválido.'),
  trackingLink: z.string().optional().or(z.literal('')),
  clarityScript: z.string().optional().or(z.literal('')),
  popupEnabled: z.boolean().optional(),
  testi1Name: z.string().optional().or(z.literal('')),
  testi1Location: z.string().optional().or(z.literal('')),
  testi2Name: z.string().optional().or(z.literal('')),
  testi2Location: z.string().optional().or(z.literal('')),
  testi3Name: z.string().optional().or(z.literal('')),
  testi3Location: z.string().optional().or(z.literal('')),
});

export type PresellFormValues = z.infer<typeof formSchema>;

interface ImageSlot { index: number; label: string; hint?: string; optional?: boolean; }

const PRODUCT_SLOTS: ImageSlot[] = [
  { index: 0, label: 'Hero / frasco principal', hint: 'Imagem principal' },
  { index: 1, label: 'Kit 1 frasco' },
  { index: 3, label: 'Kit 3 frascos' },
  { index: 4, label: 'Kit 6 frascos' },
  { index: 5, label: 'Mecanismo', hint: 'Médico / infográfico' },
];
const INGREDIENT_SLOTS: ImageSlot[] = [
  { index: 6,  label: 'Ingrediente 1' }, { index: 7,  label: 'Ingrediente 2' },
  { index: 8,  label: 'Ingrediente 3' }, { index: 9,  label: 'Ingrediente 4' },
  { index: 10, label: 'Ingrediente 5' }, { index: 11, label: 'Ingrediente 6' },
  { index: 22, label: 'Ingrediente 7', optional: true },
  { index: 23, label: 'Ingrediente 8', optional: true },
  { index: 24, label: 'Ingrediente 9', optional: true },
];
const BONUS_SLOTS: ImageSlot[] = [
  { index: 12, label: 'Bónus 1' }, { index: 13, label: 'Bónus 2' },
  { index: 18, label: 'Bónus 3', optional: true },
  { index: 19, label: 'Bónus 4', optional: true },
  { index: 20, label: 'Bónus 5', optional: true },
];
const EXTRA_SLOTS: ImageSlot[] = [
  { index: 14, label: 'Depoimento 1' }, { index: 15, label: 'Depoimento 2' },
  { index: 16, label: 'Depoimento 3' }, { index: 17, label: 'Badge garantia' },
  { index: 21, label: 'Ícones pagamento' },
];
const REVIEW_EXTRA_SLOTS: ImageSlot[] = [
  { index: 25, label: 'Scam Warning',     hint: 'Screenshot Amazon/eBay com alerta', optional: true },
  { index: 26, label: 'Foto Pros & Cons', hint: 'Frasco com ratings visuais',        optional: true },
];

const COUNTRIES = [
  "Estados Unidos","Brasil","Reino Unido","Canadá","Austrália","Portugal",
  "África do Sul","Alemanha","Argentina","Áustria","Bélgica","Bolívia","Chile",
  "Colômbia","Costa Rica","Dinamarca","Equador","Espanha","Filipinas","Finlândia",
  "França","Grécia","Guatemala","Holanda","Honduras","Hungria","Índia","Indonésia",
  "Irlanda","Israel","Itália","Japão","Malásia","México","Nicarágua","Noruega",
  "Nova Zelândia","Panamá","Paraguai","Peru","Polônia","Porto Rico","Romênia",
  "Singapura","Suécia","Suíça","Tailândia","Turquia","Uruguai","Venezuela","Vietnã"
];

export interface PresellFormProps {
  onSubmit: (values: PresellFormValues) => void;
  onClear: () => void;
  isGenerating: boolean;
  productImageUrls: string[];
  onUpdateImages: (images: string[]) => void;
  onPreview?: () => void;
}

const inputStyle: React.CSSProperties = {
  width: '100%', height: '36px', borderRadius: '8px',
  border: '1px solid #E5E7EB', fontSize: '13px', color: '#0F172A',
  padding: '0 10px', outline: 'none', background: '#fff',
  boxSizing: 'border-box', fontFamily: 'inherit',
};
const focusIn = (e: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement>) => {
  e.target.style.borderColor = '#2563EB';
  e.target.style.boxShadow = '0 0 0 3px rgba(37,99,235,0.08)';
};
const focusOut = (e: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement>) => {
  e.target.style.borderColor = '#E5E7EB';
  e.target.style.boxShadow = 'none';
};

function FieldLabel({ children, optional }: { children: React.ReactNode; optional?: boolean }) {
  return (
    <div style={{ fontSize: '11px', fontWeight: 600, color: '#374151', marginBottom: '5px' }}>
      {children}
      {optional && <span style={{ fontWeight: 400, color: '#CBD5E1', marginLeft: '4px' }}>(opcional)</span>}
    </div>
  );
}

function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <div style={{ fontSize: '10px', fontWeight: 700, color: '#D1D5DB', letterSpacing: '0.08em', textTransform: 'uppercase' as const, marginBottom: '10px', marginTop: '20px' }}>
      {children}
    </div>
  );
}

function SlotCard({ slot, imageUrl, onUpload, onRemove }: {
  slot: ImageSlot; imageUrl: string; onUpload: (f: File) => void; onRemove: () => void;
}) {
  const ref = useRef<HTMLInputElement>(null);
  const has = !!(imageUrl && imageUrl !== '');
  return (
    <div onClick={() => !has && ref.current?.click()}
      style={{ border: has ? '1.5px solid #BFDBFE' : '1.5px dashed #E5E7EB', borderRadius: '10px', background: has ? '#EFF6FF' : '#FAFAFA', minHeight: '96px', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '6px', cursor: has ? 'default' : 'pointer', position: 'relative', overflow: 'hidden', padding: '10px 8px' }}>
      {has ? (
        <>
          <img src={imageUrl} alt={slot.label} style={{ width: '100%', height: '60px', objectFit: 'contain', borderRadius: '6px' }} />
          <button type="button" onClick={e => { e.stopPropagation(); onRemove(); }}
            style={{ position: 'absolute', top: '4px', right: '4px', width: '18px', height: '18px', borderRadius: '50%', background: '#fff', border: '1px solid #E5E7EB', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}>
            <X style={{ width: '10px', height: '10px', color: '#6B7280' }} />
          </button>
          <button type="button" onClick={e => { e.stopPropagation(); ref.current?.click(); }}
            style={{ position: 'absolute', bottom: '4px', right: '4px', width: '18px', height: '18px', borderRadius: '50%', background: '#2563EB', border: 'none', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}>
            <Upload style={{ width: '9px', height: '9px', color: '#fff' }} />
          </button>
        </>
      ) : (
        <div style={{ width: '28px', height: '28px', borderRadius: '8px', background: '#F3F4F6', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <Plus style={{ width: '14px', height: '14px', color: '#D1D5DB' }} />
        </div>
      )}
      <span style={{ fontSize: '10px', fontWeight: 500, textAlign: 'center', lineHeight: 1.3, color: has ? '#1D4ED8' : '#9CA3AF' }}>
        {slot.label}
        {slot.optional && <span style={{ display: 'block', fontSize: '9px', color: '#D1D5DB' }}>opcional</span>}
      </span>
      {slot.hint && !has && <span style={{ fontSize: '9px', color: '#CBD5E1', textAlign: 'center', lineHeight: 1.2 }}>{slot.hint}</span>}
      <input ref={ref} type="file" accept="image/*" style={{ display: 'none' }}
        onChange={e => { const f = e.target.files?.[0]; if (f) onUpload(f); if (ref.current) ref.current.value = ''; }} />
    </div>
  );
}

function PgCard({ children, style }: { children: React.ReactNode; style?: React.CSSProperties }) {
  return (
    <div style={{ background: '#fff', border: '1px solid #F1F5F9', borderRadius: '16px', boxShadow: '0 1px 3px rgba(0,0,0,0.04), 0 4px 16px rgba(0,0,0,0.03)', overflow: 'hidden', ...style }}>
      {children}
    </div>
  );
}

function PgCardHeader({ icon, title, subtitle, right }: { icon: React.ReactNode; title: string; subtitle?: string; right?: React.ReactNode }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '16px 20px', borderBottom: '1px solid #F8FAFC' }}>
      <div style={{ width: '30px', height: '30px', borderRadius: '8px', background: '#EFF6FF', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, color: '#2563EB' }}>{icon}</div>
      <div style={{ flex: 1 }}>
        <div style={{ fontSize: '13px', fontWeight: 600, color: '#0F172A' }}>{title}</div>
        {subtitle && <div style={{ fontSize: '11px', color: '#94A3B8', marginTop: '1px' }}>{subtitle}</div>}
      </div>
      {right}
    </div>
  );
}

function Toggle({ checked, onChange, label, sublabel }: { checked: boolean; onChange: (v: boolean) => void; label: string; sublabel?: string }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '2px 0' }}>
      <div>
        <div style={{ fontSize: '12px', fontWeight: 600, color: '#374151' }}>{label}</div>
        {sublabel && <div style={{ fontSize: '11px', color: '#94A3B8', marginTop: '1px' }}>{sublabel}</div>}
      </div>
      <button type="button" onClick={() => onChange(!checked)}
        style={{ width: '40px', height: '22px', borderRadius: '11px', border: 'none', cursor: 'pointer', background: checked ? '#2563EB' : '#E5E7EB', position: 'relative', transition: 'background .2s', flexShrink: 0, marginLeft: '16px' }}>
        <span style={{ position: 'absolute', top: '3px', left: checked ? '21px' : '3px', width: '16px', height: '16px', borderRadius: '50%', background: '#fff', transition: 'left .2s', boxShadow: '0 1px 3px rgba(0,0,0,0.15)' }} />
      </button>
    </div>
  );
}

export function PresellForm({ onSubmit, onClear, isGenerating, productImageUrls, onUpdateImages, onPreview }: PresellFormProps) {
  const { toast } = useToast();
  const bulkRef = useRef<HTMLInputElement>(null);
  const [optOpen, setOptOpen] = useState(false);

  const form = useForm<PresellFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      productName: '', productInfo: '', salesPageDescription: '',
      officialProductUrl: '', targetLanguage: 'Estados Unidos',
      templateType: 'Robusta', copyStyle: 'White Hat (Conservador)',
      buttonColor: '#2563EB', targetUrl: 'https://seulink.com',
      trackingLink: '', clarityScript: '',
      popupEnabled: false, // ← padrão OFF
    },
  });

  const templateType = form.watch('templateType');
  const popupEnabled  = form.watch('popupEnabled');
  const isReview = templateType === 'Review';

  const getImg = (i: number) => productImageUrls[i] ?? '';
  const handleSlot = (idx: number, file: File) => {
    const r = new FileReader();
    r.onload = e => {
      if (!e.target?.result) return;
      const arr = [...productImageUrls];
      while (arr.length <= idx) arr.push('');
      arr[idx] = e.target.result as string;
      onUpdateImages(arr);
    };
    r.readAsDataURL(file);
  };
  const removeImg = (i: number) => { const arr = [...productImageUrls]; arr[i] = ''; onUpdateImages(arr); };
  const handleBulk = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    let loaded = 0; const results: string[] = [];
    files.forEach(f => {
      const r = new FileReader();
      r.onload = ev => {
        if (ev.target?.result) results.push(ev.target.result as string);
        if (++loaded === files.length) { onUpdateImages([...productImageUrls, ...results]); toast({ title: `${results.length} imagem(ns) adicionada(s)` }); }
      };
      r.readAsDataURL(f);
    });
    if (bulkRef.current) bulkRef.current.value = '';
  };

  const filledCount = productImageUrls.filter(u => u && u !== '').length;
  const slotGrid: React.CSSProperties = { display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(86px, 1fr))', gap: '10px' };
  const renderSlots = (slots: ImageSlot[]) => (
    <div style={slotGrid}>
      {slots.map(s => (
        <SlotCard key={s.index} slot={s} imageUrl={getImg(s.index)}
          onUpload={f => handleSlot(s.index, f)} onRemove={() => removeImg(s.index)} />
      ))}
    </div>
  );

  return (
    <div style={{ fontFamily: "'Inter',system-ui,sans-serif", background: '#F8FAFC', minHeight: '100vh' }}>

      {/* HEADER */}
      <div style={{ background: '#fff', borderBottom: '1px solid #F1F5F9', padding: '14px 28px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', position: 'sticky', top: 0, zIndex: 10 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <div style={{ width: '28px', height: '28px', borderRadius: '8px', background: '#2563EB', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Sparkles style={{ width: '13px', height: '13px', color: '#fff' }} />
          </div>
          <div>
            <div style={{ fontSize: '14px', fontWeight: 700, color: '#0F172A', letterSpacing: '-0.02em', lineHeight: 1.2 }}>Presell Genius</div>
            <div style={{ fontSize: '9px', color: '#94A3B8', letterSpacing: '0.05em', textTransform: 'uppercase' as const }}>AI Presell Builder</div>
          </div>
        </div>
        <button type="button" onClick={() => { form.reset(); onClear(); }}
          style={{ fontSize: '12px', color: '#94A3B8', background: 'none', border: '1px solid #F1F5F9', borderRadius: '7px', cursor: 'pointer', padding: '5px 12px' }}>
          Limpar tudo
        </button>
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <div style={{ maxWidth: '720px', margin: '0 auto', padding: '28px 20px 80px' }}>
            <div style={{ marginBottom: '24px' }}>
              <h1 style={{ fontSize: '20px', fontWeight: 700, color: '#0F172A', margin: 0, letterSpacing: '-0.025em' }}>Criar Pressel</h1>
              <p style={{ fontSize: '13px', color: '#94A3B8', margin: '4px 0 0' }}>Gere páginas profissionais de pré-venda em poucos minutos</p>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>

              {/* ── 1. PRODUTO ──────────────────────────────────────────── */}
              <PgCard>
                <PgCardHeader icon={<Package style={{ width: '14px', height: '14px' }} />} title="Produto" subtitle="Dados do produto que vai promover" />
                <div style={{ padding: '18px 20px' }}>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '12px' }}>
                    <FormField control={form.control} name="productName" render={({ field }) => (
                      <FormItem>
                        <FieldLabel>Nome do produto</FieldLabel>
                        <FormControl><input placeholder="Ex: CitrusBurn™" {...field} style={inputStyle} onFocus={focusIn} onBlur={focusOut} /></FormControl>
                        <FormMessage style={{ fontSize: '11px' }} />
                      </FormItem>
                    )} />
                    <FormField control={form.control} name="officialProductUrl" render={({ field }) => (
                      <FormItem>
                        <FieldLabel>URL da página oficial</FieldLabel>
                        <FormControl>
                          <div style={{ position: 'relative' }}>
                            <LinkIcon style={{ position: 'absolute', left: '9px', top: '50%', transform: 'translateY(-50%)', width: '12px', height: '12px', color: '#D1D5DB' }} />
                            <input placeholder="https://citrusburn.com/" {...field} style={{ ...inputStyle, paddingLeft: '27px' }} onFocus={focusIn} onBlur={focusOut} />
                          </div>
                        </FormControl>
                        <FormMessage style={{ fontSize: '11px' }} />
                      </FormItem>
                    )} />
                  </div>
                  <FormField control={form.control} name="targetUrl" render={({ field }) => (
                    <FormItem>
                      <FieldLabel>Link de afiliado</FieldLabel>
                      <FormControl>
                        <div style={{ position: 'relative' }}>
                          <LinkIcon style={{ position: 'absolute', left: '9px', top: '50%', transform: 'translateY(-50%)', width: '12px', height: '12px', color: '#D1D5DB' }} />
                          <input placeholder="https://hop.clickbank.net/?affiliate=..." {...field} style={{ ...inputStyle, paddingLeft: '27px' }} onFocus={focusIn} onBlur={focusOut} />
                        </div>
                      </FormControl>
                      <FormMessage style={{ fontSize: '11px' }} />
                    </FormItem>
                  )} />
                  {/* Campo info produto — anti-alucinação — TODOS os templates */}
                  <FormField control={form.control} name="productInfo" render={({ field }) => (
                    <FormItem style={{ marginTop: '12px' }}>
                      <FieldLabel>
                        Informações do produto
                        <span style={{ fontWeight: 400, color: '#D97706', marginLeft: '6px' }}>— cole dados da página oficial (anti-alucinação)</span>
                      </FieldLabel>
                      <FormControl>
                        <textarea
                          placeholder={
                            'Ex: Quietum Plus — suplemento auditivo com 18 ingredientes naturais.\n' +
                            'Preços: 1 frasco $69 + frete | 3 frascos $59/un frete grátis | 6 frascos $49/un frete grátis\n' +
                            'Garantia: 60 dias devolução total\n' +
                            'Ingredientes: Maca Root, Ashwagandha, Muira Puama, Tribulus Terrestris...\n' +
                            'Benefícios: suporte auditivo, redução de zumbido, clareza mental'
                          }
                          rows={4} {...field}
                          style={{ width: '100%', borderRadius: '8px', border: '1.5px solid #FCD34D', fontSize: '12px', color: '#0F172A', padding: '10px 12px', outline: 'none', background: '#FFFBEB', boxSizing: 'border-box' as const, resize: 'vertical' as const, fontFamily: 'inherit', lineHeight: 1.6 }}
                          onFocus={e => { e.target.style.borderColor = '#D97706'; e.target.style.boxShadow = '0 0 0 3px rgba(217,119,6,0.10)'; }}
                          onBlur={e =>  { e.target.style.borderColor = '#FCD34D'; e.target.style.boxShadow = 'none'; }}
                        />
                      </FormControl>
                    </FormItem>
                  )} />
                </div>
              </PgCard>

              {/* ── 2. CONFIGURAÇÃO ─────────────────────────────────────── */}
              <PgCard>
                <PgCardHeader icon={<Globe style={{ width: '14px', height: '14px' }} />} title="Configuração" subtitle="Mercado alvo, modelo e cor" />
                <div style={{ padding: '18px 20px' }}>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 110px', gap: '12px' }}>
                    <FormField control={form.control} name="targetLanguage" render={({ field }) => (
                      <FormItem>
                        <FieldLabel>País de destino</FieldLabel>
                        <Select onValueChange={field.onChange} value={field.value}>
                          <FormControl><SelectTrigger style={{ height: '36px', fontSize: '13px', borderRadius: '8px', border: '1px solid #E5E7EB' }}><SelectValue /></SelectTrigger></FormControl>
                          <SelectContent>{COUNTRIES.map(c => <SelectItem key={c} value={c} style={{ fontSize: '13px' }}>{c}</SelectItem>)}</SelectContent>
                        </Select>
                      </FormItem>
                    )} />
                    <FormField control={form.control} name="templateType" render={({ field }) => (
                      <FormItem>
                        <FieldLabel>Modelo</FieldLabel>
                        <Select onValueChange={field.onChange} value={field.value}>
                          <FormControl><SelectTrigger style={{ height: '36px', fontSize: '13px', borderRadius: '8px', border: '1px solid #E5E7EB' }}><SelectValue /></SelectTrigger></FormControl>
                          <SelectContent>
                            <SelectItem value="Robusta"         style={{ fontSize: '13px' }}>Robusta White</SelectItem>
                            <SelectItem value="Lançamento"      style={{ fontSize: '13px' }}>Robusta Black</SelectItem>
                            <SelectItem value="Review"          style={{ fontSize: '13px' }}>Review</SelectItem>
                            <SelectItem value="Lista (Top 3/5)" style={{ fontSize: '13px' }}>Top 5</SelectItem>
                            <SelectItem value="Cookie"          style={{ fontSize: '13px' }}>Cookie</SelectItem>
                          </SelectContent>
                        </Select>
                      </FormItem>
                    )} />
                    <FormField control={form.control} name="buttonColor" render={({ field }) => (
                      <FormItem>
                        <FieldLabel>Cor</FieldLabel>
                        <FormControl>
                          <div style={{ display: 'flex', gap: '6px' }}>
                            <input type="color" value={field.value} onChange={field.onChange}
                              style={{ width: '36px', height: '36px', borderRadius: '8px', border: '1px solid #E5E7EB', padding: '3px', cursor: 'pointer', background: '#fff' }} />
                            <input type="text" value={field.value} onChange={field.onChange}
                              style={{ flex: 1, height: '36px', borderRadius: '8px', border: '1px solid #E5E7EB', fontSize: '11px', color: '#0F172A', padding: '0 6px', outline: 'none', fontFamily: 'monospace', textTransform: 'uppercase' as const, boxSizing: 'border-box' as const }}
                              onFocus={e => { e.target.style.borderColor = '#2563EB'; }} onBlur={e => { e.target.style.borderColor = '#E5E7EB'; }} />
                          </div>
                        </FormControl>
                      </FormItem>
                    )} />
                  </div>
                </div>
              </PgCard>

              {/* ── 3. CARD REVIEW (dinâmico — só aparece quando Review) ── */}
              {isReview && (
                <PgCard style={{ border: '1.5px solid #FCD34D' }}>
                  {/* Header âmbar */}
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '16px 20px', borderBottom: '1px solid #FEF3C7', background: 'linear-gradient(135deg,#FFFBEB 0%,#fff 100%)' }}>
                    <div style={{ width: '30px', height: '30px', borderRadius: '8px', background: '#FEF3C7', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                      <AlertTriangle style={{ width: '14px', height: '14px', color: '#D97706' }} />
                    </div>
                    <div style={{ flex: 1 }}>
                      <div style={{ fontSize: '13px', fontWeight: 700, color: '#92400E' }}>Dados do Produto — Review</div>
                      <div style={{ fontSize: '11px', color: '#B45309', marginTop: '1px' }}>
                        Preencha para evitar que a IA invente ingredientes, preços ou nome do produto
                      </div>
                    </div>
                  </div>

                  <div style={{ padding: '18px 20px' }}>
                    {/* Separador + toggle popup */}
                    <div style={{ borderTop: '1px solid #FEF3C7', paddingTop: '14px' }}>
                      <FormField control={form.control} name="popupEnabled" render={({ field }) => (
                        <Toggle
                          checked={!!field.value}
                          onChange={field.onChange}
                          label='Popup "social proof"'
                          sublabel='Notificação "X acabou de comprar" — canto inferior esquerdo'
                        />
                      )} />
                    </div>
                  </div>
                </PgCard>
              )}

              {/* ── 4. IMAGENS ──────────────────────────────────────────── */}
              <PgCard>
                <PgCardHeader
                  icon={<ImageIcon style={{ width: '14px', height: '14px' }} />}
                  title="Imagens"
                  subtitle={`${filledCount} slot${filledCount !== 1 ? 's' : ''} preenchido${filledCount !== 1 ? 's' : ''}`}
                  right={
                    <button type="button" onClick={() => bulkRef.current?.click()}
                      style={{ display: 'flex', alignItems: 'center', gap: '5px', fontSize: '11px', fontWeight: 500, color: '#6B7280', background: 'none', border: '1px solid #E5E7EB', borderRadius: '7px', padding: '5px 10px', cursor: 'pointer' }}>
                      <Upload style={{ width: '10px', height: '10px' }} /> Upload em bloco
                    </button>
                  }
                />
                <div style={{ padding: '18px 20px' }}>
                  <input ref={bulkRef} type="file" multiple accept="image/*" style={{ display: 'none' }} onChange={handleBulk} />
                  <SectionLabel>Produto principal</SectionLabel>
                  {renderSlots(PRODUCT_SLOTS)}
                  <SectionLabel>Ingredientes</SectionLabel>
                  {renderSlots(INGREDIENT_SLOTS)}
                  <SectionLabel>Bónus</SectionLabel>
                  {renderSlots(BONUS_SLOTS)}
                  <SectionLabel>Extras</SectionLabel>
                  {renderSlots(EXTRA_SLOTS)}
                  {isReview && (
                    <>
                      <SectionLabel>Review — secções especiais</SectionLabel>
                      <div style={{ background: '#F0F9FF', border: '1px solid #BAE6FD', borderRadius: '8px', padding: '8px 12px', marginBottom: '10px' }}>
                        <div style={{ fontSize: '11px', color: '#0369A1', fontWeight: 600 }}>
                          Slots opcionais — se não carregar, a secção aparece só com texto
                        </div>
                      </div>
                      {renderSlots(REVIEW_EXTRA_SLOTS)}
                      <SectionLabel>Depoimentos — nomes reais (opcional)</SectionLabel>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                        {([1,2,3] as const).map(n => (
                          <div key={n} style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
                            <FormField control={form.control} name={`testi${n}Name` as any} render={({ field }) => (
                              <FormItem>
                                <FieldLabel optional>Depoimento {n} — nome</FieldLabel>
                                <FormControl><input placeholder={`Ex: Sarah M.`} {...field} style={inputStyle} onFocus={focusIn} onBlur={focusOut} /></FormControl>
                              </FormItem>
                            )} />
                            <FormField control={form.control} name={`testi${n}Location` as any} render={({ field }) => (
                              <FormItem>
                                <FieldLabel optional>Localização</FieldLabel>
                                <FormControl><input placeholder={`Ex: Austin, TX`} {...field} style={inputStyle} onFocus={focusIn} onBlur={focusOut} /></FormControl>
                              </FormItem>
                            )} />
                          </div>
                        ))}
                      </div>
                    </>
                  )}
                </div>
              </PgCard>

              {/* ── 5. OTIMIZAÇÃO (colapsível) ───────────────────────────── */}
              <PgCard>
                <div onClick={() => setOptOpen(v => !v)} style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '16px 20px', cursor: 'pointer', userSelect: 'none' as const }}>
                  <div style={{ width: '30px', height: '30px', borderRadius: '8px', background: '#EFF6FF', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, color: '#2563EB' }}>
                    <SlidersHorizontal style={{ width: '14px', height: '14px' }} />
                  </div>
                  <div style={{ flex: 1 }}>
                    <span style={{ fontSize: '13px', fontWeight: 600, color: '#0F172A' }}>Otimização</span>
                    <span style={{ fontSize: '11px', fontWeight: 400, color: '#CBD5E1', marginLeft: '6px' }}>opcional</span>
                    <div style={{ fontSize: '11px', color: '#94A3B8', marginTop: '1px' }}>Ângulo, persona e insights do Clarity</div>
                  </div>
                  <ChevronDown style={{ width: '15px', height: '15px', color: '#CBD5E1', transition: 'transform 0.2s', transform: optOpen ? 'rotate(180deg)' : 'none' }} />
                </div>
                {optOpen && (
                  <div style={{ borderTop: '1px solid #F8FAFC', padding: '18px 20px' }}>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '12px' }}>
                      <FormField control={form.control} name="salesPageDescription" render={({ field }) => (
                        <FormItem>
                          <FieldLabel>Ângulo específico</FieldLabel>
                          <FormControl><input placeholder="Ex: Focar em mulheres 40+ com energia baixa" {...field} style={inputStyle} onFocus={focusIn} onBlur={focusOut} /></FormControl>
                        </FormItem>
                      )} />
                      <div>
                        <FieldLabel>Persona</FieldLabel>
                        <input placeholder="Ex: Mãe, 45 anos, trabalha fora" style={inputStyle} onFocus={focusIn} onBlur={focusOut} />
                      </div>
                    </div>
                    <FormField control={form.control} name="clarityScript" render={({ field }) => (
                      <FormItem>
                        <FieldLabel>Clarity insights</FieldLabel>
                        <FormControl>
                          <textarea placeholder={`Ex: usuários não estão clicando no botão CTA\nvisitantes não chegam à seção de preço`} rows={3} {...field}
                            style={{ width: '100%', borderRadius: '8px', border: '1px solid #E5E7EB', fontSize: '13px', color: '#0F172A', padding: '8px 10px', outline: 'none', background: '#fff', boxSizing: 'border-box' as const, resize: 'vertical' as const, fontFamily: 'inherit' }}
                            onFocus={focusIn} onBlur={focusOut} />
                        </FormControl>
                      </FormItem>
                    )} />
                    <div style={{ marginTop: '12px' }}>
                      <FormField control={form.control} name="trackingLink" render={({ field }) => (
                        <FormItem>
                          <FieldLabel optional>Link de rastreio</FieldLabel>
                          <FormControl><input placeholder="https://..." {...field} style={inputStyle} onFocus={focusIn} onBlur={focusOut} /></FormControl>
                        </FormItem>
                      )} />
                    </div>
                  </div>
                )}
              </PgCard>

              {/* ── BOTÕES ──────────────────────────────────────────────── */}
              <div style={{ display: 'flex', gap: '10px', paddingTop: '6px' }}>
                <button type="submit" disabled={isGenerating}
                  style={{ flex: 1, maxWidth: '280px', height: '46px', background: isGenerating ? '#93C5FD' : '#2563EB', color: '#fff', border: 'none', borderRadius: '12px', fontSize: '14px', fontWeight: 600, cursor: isGenerating ? 'not-allowed' : 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', letterSpacing: '-0.01em' }}
                  onMouseEnter={e => { if (!isGenerating) (e.currentTarget as HTMLButtonElement).style.background = '#1D4ED8'; }}
                  onMouseLeave={e => { if (!isGenerating) (e.currentTarget as HTMLButtonElement).style.background = '#2563EB'; }}>
                  <Sparkles style={{ width: '14px', height: '14px' }} />
                  {isGenerating ? 'Gerando...' : 'Gerar Pressel'}
                </button>
                {onPreview && (
                  <button type="button" onClick={onPreview}
                    style={{ height: '46px', padding: '0 20px', background: '#fff', color: '#374151', border: '1px solid #E5E7EB', borderRadius: '12px', fontSize: '13px', fontWeight: 500, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '7px' }}
                    onMouseEnter={e => { (e.currentTarget as HTMLButtonElement).style.background = '#F9FAFB'; }}
                    onMouseLeave={e => { (e.currentTarget as HTMLButtonElement).style.background = '#fff'; }}>
                    <Eye style={{ width: '14px', height: '14px' }} /> Visualizar página
                  </button>
                )}
              </div>

            </div>
          </div>
        </form>
      </Form>
    </div>
  );
}
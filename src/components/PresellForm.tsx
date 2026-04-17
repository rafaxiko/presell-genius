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
  siteName: z.string().optional().or(z.literal('')),
  testi1Name: z.string().optional().or(z.literal('')),
  testi1Location: z.string().optional().or(z.literal('')),
  testi2Name: z.string().optional().or(z.literal('')),
  testi2Location: z.string().optional().or(z.literal('')),
  testi3Name: z.string().optional().or(z.literal('')),
  testi3Location: z.string().optional().or(z.literal('')),
});

export type PresellFormValues = z.infer<typeof formSchema>;

interface ImageSlot { index: number; label: string; hint?: string; optional?: boolean; }

// Slot constants — kept for reference by the generator
const HERO_MECH_SLOTS: ImageSlot[] = [
  { index: 0, label: 'Hero / frasco principal', hint: 'Imagem principal' },
  { index: 5, label: 'Mecanismo', hint: 'Médico / infográfico' },
];
const KIT_SLOTS: ImageSlot[] = [
  { index: 1, label: 'Kit 1 frasco' },
  { index: 3, label: 'Kit 3 frascos' },
  { index: 4, label: 'Kit 6 frascos' },
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
const TESTI_SLOTS: ImageSlot[] = [
  { index: 14, label: 'Depoimento 1', optional: true },
  { index: 15, label: 'Depoimento 2', optional: true },
  { index: 16, label: 'Depoimento 3', optional: true },
];
const BADGE_SLOTS: ImageSlot[] = [
  { index: 17, label: 'Badge garantia' },
  { index: 21, label: 'Ícones pagamento' },
];
const REVIEW_EXTRA_SLOTS: ImageSlot[] = [
  { index: 25, label: 'Scam Warning',     hint: 'Screenshot Amazon/eBay com alerta', optional: true },
  { index: 26, label: 'Foto Pros & Cons', hint: 'Frasco com ratings visuais',        optional: true },
];
const LOGO_SLOT: ImageSlot = { index: 27, label: 'Logo', optional: true };

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

function FieldLabel({
  children, optional, required,
}: { children: React.ReactNode; optional?: boolean; required?: boolean }) {
  return (
    <div style={{ fontSize: '11px', fontWeight: 600, color: '#374151', marginBottom: '5px', display: 'flex', alignItems: 'center', gap: '2px' }}>
      {children}
      {required && <span style={{ color: '#EF4444', fontSize: '11px', marginLeft: '1px' }}>*</span>}
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

/** Full-size slot card (used for product hero, mechanism, kit, badge, extras) */
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

/** Compact slot card used inline in ingredient / bonus / testimonial rows */
function SmallSlotCard({ slot, imageUrl, onUpload, onRemove }: {
  slot: ImageSlot; imageUrl: string; onUpload: (f: File) => void; onRemove: () => void;
}) {
  const ref = useRef<HTMLInputElement>(null);
  const has = !!(imageUrl && imageUrl !== '');
  return (
    <div onClick={() => !has && ref.current?.click()}
      style={{ border: has ? '1.5px solid #BFDBFE' : '1.5px dashed #E5E7EB', borderRadius: '8px', background: has ? '#EFF6FF' : '#FAFAFA', height: '58px', width: '68px', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: has ? 'default' : 'pointer', position: 'relative', overflow: 'hidden', flexShrink: 0 }}>
      {has ? (
        <>
          <img src={imageUrl} alt={slot.label} style={{ maxHeight: '42px', maxWidth: '60px', objectFit: 'contain' }} />
          <button type="button" onClick={e => { e.stopPropagation(); onRemove(); }}
            style={{ position: 'absolute', top: '2px', right: '2px', width: '15px', height: '15px', borderRadius: '50%', background: '#fff', border: '1px solid #E5E7EB', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', padding: 0 }}>
            <X style={{ width: '8px', height: '8px', color: '#6B7280' }} />
          </button>
          <button type="button" onClick={e => { e.stopPropagation(); ref.current?.click(); }}
            style={{ position: 'absolute', bottom: '2px', right: '2px', width: '15px', height: '15px', borderRadius: '50%', background: '#2563EB', border: 'none', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', padding: 0 }}>
            <Upload style={{ width: '7px', height: '7px', color: '#fff' }} />
          </button>
        </>
      ) : (
        <Plus style={{ width: '12px', height: '12px', color: '#D1D5DB' }} />
      )}
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
  const logoRef = useRef<HTMLInputElement>(null);
  const [optOpen, setOptOpen] = useState(false);

  // Fixed-length arrays aligned 1:1 with image slot arrays
  const [ingredients, setIngredients] = useState(
    INGREDIENT_SLOTS.map(() => ({ name: '', benefit: '' }))
  );
  const [bonuses, setBonuses] = useState(
    BONUS_SLOTS.map(() => ({ title: '', description: '' }))
  );
  const [pricingRows, setPricingRows] = useState([
    { label: '1 Bottle',  per_bottle: '', total: '' },
    { label: '3 Bottles', per_bottle: '', total: '' },
    { label: '6 Bottles', per_bottle: '', total: '' },
  ]);
  const [guaranteeDays, setGuaranteeDays] = useState('');
  const [heroHeadline, setHeroHeadline] = useState('');
  const [visibleIngredients, setVisibleIngredients] = useState(3);

  const form = useForm<PresellFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      productName: '', productInfo: '', salesPageDescription: '',
      officialProductUrl: '', targetLanguage: 'Estados Unidos',
      templateType: 'Robusta', copyStyle: 'White Hat (Conservador)',
      buttonColor: '#2563EB', targetUrl: 'https://seulink.com',
      trackingLink: '', clarityScript: '',
      popupEnabled: false,
      siteName: '',
    },
  });

  const templateType = form.watch('templateType');
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

  const handleFormSubmit = (values: PresellFormValues) => {
    const structured: Record<string, any> = {};
    const validIngr = ingredients.filter(i => i.name.trim());
    if (validIngr.length) structured.ingredients = validIngr;
    const validBonus = bonuses.filter(b => b.title.trim());
    if (validBonus.length) structured.bonuses = validBonus;
    const hasPricing = pricingRows.some(r => r.per_bottle.trim() || r.total.trim());
    if (hasPricing) structured.pricing = {
      bundle_1: pricingRows[0],
      bundle_3: pricingRows[1],
      bundle_6: pricingRows[2],
    };
    if (guaranteeDays.trim()) structured.guarantee_days = guaranteeDays;
    if (heroHeadline.trim()) structured.hero_headline = heroHeadline;
    const parts: string[] = [];
    if (Object.keys(structured).length) parts.push(JSON.stringify(structured));
    if (values.productInfo?.trim()) parts.push(values.productInfo.trim());
    onSubmit({ ...values, productInfo: parts.join('\n\n') });
  };

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

  return (
    <div style={{ fontFamily: "'Inter',system-ui,sans-serif", background: '#F8FAFC', minHeight: '100vh' }}>

      {/* HEADER */}
      <div style={{ background: '#fff', borderBottom: '1px solid #F1F5F9', padding: '14px 28px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', position: 'sticky', top: 0, zIndex: 10 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <img src="/Logo Presell Genius.jpg" style={{ height: '32px', width: 'auto' }} alt="Presell Genius" />
        </div>
        <button type="button" onClick={() => { form.reset(); onClear(); }}
          style={{ fontSize: '12px', color: '#94A3B8', background: 'none', border: '1px solid #F1F5F9', borderRadius: '7px', cursor: 'pointer', padding: '5px 12px' }}>
          Limpar tudo
        </button>
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(handleFormSubmit)}>
          <div style={{ maxWidth: '720px', margin: '0 auto', padding: '28px 20px 80px' }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>

              {/* ── 1. PRODUTO ──────────────────────────────────────────── */}
              <PgCard>
                <PgCardHeader icon={<Package style={{ width: '14px', height: '14px' }} />} title="Produto" subtitle="Dados do produto que vai promover" />
                <div style={{ padding: '18px 20px' }}>

                  {/* Nome + URL oficial */}
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '12px' }}>
                    <FormField control={form.control} name="productName" render={({ field }) => (
                      <FormItem>
                        <FieldLabel required>Nome do produto</FieldLabel>
                        <FormControl><input placeholder="Ex: CitrusBurn™" {...field} style={inputStyle} onFocus={focusIn} onBlur={focusOut} /></FormControl>
                        <FormMessage style={{ fontSize: '11px' }} />
                      </FormItem>
                    )} />
                    <FormField control={form.control} name="officialProductUrl" render={({ field }) => (
                      <FormItem>
                        <FieldLabel required>URL da página oficial</FieldLabel>
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

                  {/* Link afiliado */}
                  <div style={{ marginBottom: '10px' }}>
                    <FormField control={form.control} name="targetUrl" render={({ field }) => (
                      <FormItem>
                        <FieldLabel required>Link de afiliado</FieldLabel>
                        <FormControl>
                          <div style={{ position: 'relative' }}>
                            <LinkIcon style={{ position: 'absolute', left: '9px', top: '50%', transform: 'translateY(-50%)', width: '12px', height: '12px', color: '#D1D5DB' }} />
                            <input placeholder="https://hop.clickbank.net/?affiliate=..." {...field} style={{ ...inputStyle, paddingLeft: '27px' }} onFocus={focusIn} onBlur={focusOut} />
                          </div>
                        </FormControl>
                        <FormMessage style={{ fontSize: '11px' }} />
                      </FormItem>
                    )} />
                  </div>

                  {/* Link de rastreamento — moved here from Otimização */}
                  <div style={{ marginBottom: '14px' }}>
                    <FormField control={form.control} name="trackingLink" render={({ field }) => (
                      <FormItem>
                        <FieldLabel optional>Link de rastreamento</FieldLabel>
                        <FormControl>
                          <div style={{ position: 'relative' }}>
                            <LinkIcon style={{ position: 'absolute', left: '9px', top: '50%', transform: 'translateY(-50%)', width: '12px', height: '12px', color: '#D1D5DB' }} />
                            <input placeholder="https://..." {...field} style={{ ...inputStyle, paddingLeft: '27px' }} onFocus={focusIn} onBlur={focusOut} />
                          </div>
                        </FormControl>
                      </FormItem>
                    )} />
                  </div>

                  {/* Hero headline */}
                  <div style={{ borderTop: '1px solid #F1F5F9', paddingTop: '14px' }}>
                    <div style={{ marginBottom: '12px' }}>
                      <FieldLabel optional>Hero Headline</FieldLabel>
                      <input value={heroHeadline} onChange={e => setHeroHeadline(e.target.value)}
                        placeholder="Ex: Restore Your Hearing Naturally"
                        style={inputStyle} onFocus={focusIn} onBlur={focusOut} />
                    </div>

                    {/* Extra info */}
                    <FormField control={form.control} name="productInfo" render={({ field }) => (
                      <FormItem>
                        <FieldLabel optional>Informação extra</FieldLabel>
                        <FormControl>
                          <textarea placeholder="Qualquer informação adicional sobre o produto..." rows={2} {...field}
                            style={{ width: '100%', borderRadius: '8px', border: '1px solid #E5E7EB', fontSize: '12px', color: '#0F172A', padding: '8px 10px', outline: 'none', background: '#fff', boxSizing: 'border-box' as const, resize: 'vertical' as const, fontFamily: 'inherit', lineHeight: 1.6 }}
                            onFocus={focusIn} onBlur={focusOut} />
                        </FormControl>
                      </FormItem>
                    )} />
                  </div>
                </div>
              </PgCard>

              {/* ── 2. CONFIGURAÇÃO ─────────────────────────────────────── */}
              <PgCard>
                <PgCardHeader icon={<Globe style={{ width: '14px', height: '14px' }} />} title="Configuração" subtitle="Mercado alvo, modelo e cor" />
                <div style={{ padding: '18px 20px' }}>

                  {/* Nome do site / Logo — above model selector */}
                  <div style={{ display: 'grid', gridTemplateColumns: '68px 1fr', gap: '10px', marginBottom: '14px', alignItems: 'end' }}>
                    <div>
                      <FieldLabel optional>Logo</FieldLabel>
                      {/* Logo slot — index 27 */}
                      {(() => {
                        const has = !!(getImg(LOGO_SLOT.index) && getImg(LOGO_SLOT.index) !== '');
                        return (
                          <div onClick={() => !has && logoRef.current?.click()}
                            style={{ border: has ? '1.5px solid #BFDBFE' : '1.5px dashed #E5E7EB', borderRadius: '8px', background: has ? '#EFF6FF' : '#FAFAFA', height: '36px', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: has ? 'default' : 'pointer', position: 'relative', overflow: 'hidden' }}>
                            {has ? (
                              <>
                                <img src={getImg(LOGO_SLOT.index)} alt="Logo" style={{ maxHeight: '28px', maxWidth: '60px', objectFit: 'contain' }} />
                                <button type="button" onClick={e => { e.stopPropagation(); removeImg(LOGO_SLOT.index); }}
                                  style={{ position: 'absolute', top: '2px', right: '2px', width: '14px', height: '14px', borderRadius: '50%', background: '#fff', border: '1px solid #E5E7EB', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', padding: 0 }}>
                                  <X style={{ width: '7px', height: '7px', color: '#6B7280' }} />
                                </button>
                              </>
                            ) : (
                              <Upload style={{ width: '10px', height: '10px', color: '#D1D5DB' }} />
                            )}
                            <input ref={logoRef} type="file" accept="image/*" style={{ display: 'none' }}
                              onChange={e => { const f = e.target.files?.[0]; if (f) handleSlot(LOGO_SLOT.index, f); if (logoRef.current) logoRef.current.value = ''; }} />
                          </div>
                        );
                      })()}
                    </div>
                    <FormField control={form.control} name="siteName" render={({ field }) => (
                      <FormItem>
                        <FieldLabel optional>Nome do site</FieldLabel>
                        <FormControl>
                          <input placeholder="Ex: HealthReviewHub" {...field} style={inputStyle} onFocus={focusIn} onBlur={focusOut} />
                        </FormControl>
                      </FormItem>
                    )} />
                  </div>

                  {/* País + Modelo + Cor */}
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 110px', gap: '12px' }}>
                    <FormField control={form.control} name="targetLanguage" render={({ field }) => (
                      <FormItem>
                        <FieldLabel required>País de destino</FieldLabel>
                        <Select onValueChange={field.onChange} value={field.value}>
                          <FormControl><SelectTrigger style={{ height: '36px', fontSize: '13px', borderRadius: '8px', border: '1px solid #E5E7EB' }}><SelectValue /></SelectTrigger></FormControl>
                          <SelectContent>{COUNTRIES.map(c => <SelectItem key={c} value={c} style={{ fontSize: '13px' }}>{c}</SelectItem>)}</SelectContent>
                        </Select>
                      </FormItem>
                    )} />
                    <FormField control={form.control} name="templateType" render={({ field }) => (
                      <FormItem>
                        <FieldLabel required>Modelo</FieldLabel>
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
                        <FieldLabel optional>Cor</FieldLabel>
                        <FormControl>
                          <div style={{ display: 'flex', gap: '6px' }}>
                            <input type="color" defaultValue="#541213" value={/^#[0-9a-fA-F]{6}$/.test(field.value) ? field.value : '#541213'} onChange={field.onChange}
                              style={{ width: '36px', height: '36px', borderRadius: '8px', border: '1px solid #E5E7EB', padding: '3px', cursor: 'pointer', background: '#fff' }} />
                            <input type="text" value={field.value} onChange={field.onChange}
                              style={{ flex: 1, height: '36px', borderRadius: '8px', border: '1px solid #E5E7EB', fontSize: '11px', color: '#0F172A', padding: '0 6px', outline: 'none', fontFamily: 'monospace', textTransform: 'uppercase' as const, boxSizing: 'border-box' as const }}
                              onFocus={e => { e.target.style.borderColor = '#2563EB'; }}
                              onBlur={e => {
                                e.target.style.borderColor = '#E5E7EB';
                                if (!/^#[0-9a-fA-F]{6}$/.test(field.value)) field.onChange('#541213');
                              }} />
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

                  {/* Produto principal: hero + mechanism */}
                  <SectionLabel>Produto principal</SectionLabel>
                  <div style={slotGrid}>
                    {HERO_MECH_SLOTS.map(s => (
                      <SlotCard key={s.index} slot={s} imageUrl={getImg(s.index)}
                        onUpload={f => handleSlot(s.index, f)} onRemove={() => removeImg(s.index)} />
                    ))}
                  </div>

                  {/* Pricing table — card rows with inline kit image slots */}
                  <SectionLabel>Kit + Preços <span style={{ fontWeight: 400, color: '#CBD5E1', fontSize: '9px', textTransform: 'none' as const, letterSpacing: 0 }}>(opcional)</span></SectionLabel>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                    {pricingRows.map((row, i) => {
                      const kitSlot = KIT_SLOTS[i];
                      return (
                        <div key={i} style={{
                          display: 'grid',
                          gridTemplateColumns: '68px 1fr 92px 92px',
                          alignItems: 'center',
                          gap: '10px',
                          padding: '10px 14px',
                          background: '#FAFAFA',
                          border: '1.5px solid #F1F5F9',
                          borderRadius: '10px',
                          position: 'relative' as const,
                        }}>
                          {/* Kit image upload */}
                          <SmallSlotCard
                            slot={kitSlot}
                            imageUrl={getImg(kitSlot.index)}
                            onUpload={f => handleSlot(kitSlot.index, f)}
                            onRemove={() => removeImg(kitSlot.index)}
                          />
                          {/* Kit label */}
                          <div>
                            <div style={{ fontSize: '13px', fontWeight: 600, color: '#0F172A', lineHeight: 1.2, letterSpacing: '-0.01em' }}>{row.label}</div>
                          </div>
                          {/* Per bottle */}
                          <div>
                            <div style={{ fontSize: '9px', fontWeight: 700, color: '#94A3B8', textTransform: 'uppercase' as const, letterSpacing: '0.06em', marginBottom: '4px' }}>/ frasco</div>
                            <input
                              placeholder="$49.00"
                              value={row.per_bottle}
                              onChange={e => setPricingRows(p => p.map((r, j) => j === i ? { ...r, per_bottle: e.target.value } : r))}
                              style={{ ...inputStyle, height: '28px', fontSize: '12px', fontFamily: 'ui-monospace,monospace' }}
                              onFocus={focusIn} onBlur={focusOut}
                            />
                          </div>
                          {/* Total */}
                          <div>
                            <div style={{ fontSize: '9px', fontWeight: 700, color: '#94A3B8', textTransform: 'uppercase' as const, letterSpacing: '0.06em', marginBottom: '4px' }}>Total</div>
                            <input
                              placeholder="$294.00"
                              value={row.total}
                              onChange={e => setPricingRows(p => p.map((r, j) => j === i ? { ...r, total: e.target.value } : r))}
                              style={{ ...inputStyle, height: '28px', fontSize: '12px', fontFamily: 'ui-monospace,monospace' }}
                              onFocus={focusIn} onBlur={focusOut}
                            />
                          </div>
                        </div>
                      );
                    })}
                  </div>

                  {/* Ingredients: paired rows of slot + name + benefit, progressive disclosure */}
                  <SectionLabel>Ingredientes <span style={{ fontWeight: 400, color: '#CBD5E1', fontSize: '9px', textTransform: 'none' as const, letterSpacing: 0 }}>(opcional)</span></SectionLabel>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '5px' }}>
                    {INGREDIENT_SLOTS.slice(0, visibleIngredients).map((slot, i) => (
                      <div key={slot.index} style={{ display: 'grid', gridTemplateColumns: '68px 1fr 1fr', gap: '6px', alignItems: 'center' }}>
                        <SmallSlotCard slot={slot} imageUrl={getImg(slot.index)}
                          onUpload={f => handleSlot(slot.index, f)} onRemove={() => removeImg(slot.index)} />
                        <input
                          placeholder={`Nome — Ingrediente ${i + 1}`}
                          value={ingredients[i]?.name ?? ''}
                          onChange={e => setIngredients(p => p.map((r, j) => j === i ? { ...r, name: e.target.value } : r))}
                          style={{ ...inputStyle, height: '30px', fontSize: '12px' }} onFocus={focusIn} onBlur={focusOut}
                        />
                        <input
                          placeholder="Benefício"
                          value={ingredients[i]?.benefit ?? ''}
                          onChange={e => setIngredients(p => p.map((r, j) => j === i ? { ...r, benefit: e.target.value } : r))}
                          style={{ ...inputStyle, height: '30px', fontSize: '12px' }} onFocus={focusIn} onBlur={focusOut}
                        />
                      </div>
                    ))}
                  </div>
                  {visibleIngredients < INGREDIENT_SLOTS.length && (
                    <button
                      type="button"
                      onClick={() => setVisibleIngredients(v => Math.min(v + 1, INGREDIENT_SLOTS.length))}
                      style={{ marginTop: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '5px', fontSize: '11px', fontWeight: 500, color: '#2563EB', background: 'none', border: '1px dashed #BFDBFE', borderRadius: '8px', padding: '7px 14px', cursor: 'pointer', width: '100%' }}
                    >
                      <Plus style={{ width: '11px', height: '11px' }} /> Adicionar ingrediente
                    </button>
                  )}

                  {/* Bonuses: paired rows of slot + title + description */}
                  <SectionLabel>Bónus <span style={{ fontWeight: 400, color: '#CBD5E1', fontSize: '9px', textTransform: 'none' as const, letterSpacing: 0 }}>(opcional)</span></SectionLabel>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '5px' }}>
                    {BONUS_SLOTS.map((slot, i) => (
                      <div key={slot.index} style={{ display: 'grid', gridTemplateColumns: '68px 1fr 1.4fr', gap: '6px', alignItems: 'center' }}>
                        <SmallSlotCard slot={slot} imageUrl={getImg(slot.index)}
                          onUpload={f => handleSlot(slot.index, f)} onRemove={() => removeImg(slot.index)} />
                        <input
                          placeholder={`${slot.label}${slot.optional ? ' (opcional)' : ''}`}
                          value={bonuses[i]?.title ?? ''}
                          onChange={e => setBonuses(p => p.map((r, j) => j === i ? { ...r, title: e.target.value } : r))}
                          style={{ ...inputStyle, height: '30px', fontSize: '12px' }} onFocus={focusIn} onBlur={focusOut}
                        />
                        <input
                          placeholder="Descrição breve"
                          value={bonuses[i]?.description ?? ''}
                          onChange={e => setBonuses(p => p.map((r, j) => j === i ? { ...r, description: e.target.value } : r))}
                          style={{ ...inputStyle, height: '30px', fontSize: '12px' }} onFocus={focusIn} onBlur={focusOut}
                        />
                      </div>
                    ))}
                  </div>

                  {/* Testimonials: paired with name/location — always visible */}
                  <SectionLabel>Depoimentos <span style={{ fontWeight: 400, color: '#CBD5E1', fontSize: '9px', textTransform: 'none' as const, letterSpacing: 0 }}>(opcional)</span></SectionLabel>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '5px' }}>
                    {([0, 1, 2] as const).map(i => (
                      <div key={i} style={{ display: 'grid', gridTemplateColumns: '68px 1fr 1fr', gap: '6px', alignItems: 'center' }}>
                        <SmallSlotCard slot={TESTI_SLOTS[i]} imageUrl={getImg(TESTI_SLOTS[i].index)}
                          onUpload={f => handleSlot(TESTI_SLOTS[i].index, f)} onRemove={() => removeImg(TESTI_SLOTS[i].index)} />
                        <FormField control={form.control} name={`testi${i + 1}Name` as any} render={({ field }) => (
                          <FormItem style={{ margin: 0 }}>
                            <FormControl>
                              <input placeholder={`Depoimento ${i + 1} — nome`} {...field}
                                style={{ ...inputStyle, height: '30px', fontSize: '12px' }} onFocus={focusIn} onBlur={focusOut} />
                            </FormControl>
                          </FormItem>
                        )} />
                        <FormField control={form.control} name={`testi${i + 1}Location` as any} render={({ field }) => (
                          <FormItem style={{ margin: 0 }}>
                            <FormControl>
                              <input placeholder="Localização (Ex: Austin, TX)" {...field}
                                style={{ ...inputStyle, height: '30px', fontSize: '12px' }} onFocus={focusIn} onBlur={focusOut} />
                            </FormControl>
                          </FormItem>
                        )} />
                      </div>
                    ))}
                  </div>

                  {/* Badge garantia + days + payment icons */}
                  <SectionLabel>Garantia + Pagamento</SectionLabel>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', alignItems: 'start' }}>
                    {/* Badge slot + days input stacked */}
                    <div>
                      <SlotCard slot={BADGE_SLOTS[0]} imageUrl={getImg(BADGE_SLOTS[0].index)}
                        onUpload={f => handleSlot(BADGE_SLOTS[0].index, f)} onRemove={() => removeImg(BADGE_SLOTS[0].index)} />
                      <div style={{ marginTop: '8px' }}>
                        <FieldLabel optional>Dias de garantia</FieldLabel>
                        <input
                          type="number"
                          value={guaranteeDays}
                          onChange={e => setGuaranteeDays(e.target.value)}
                          placeholder="60"
                          style={{ ...inputStyle, textAlign: 'center' as const }}
                          onFocus={focusIn} onBlur={focusOut}
                        />
                      </div>
                    </div>
                    {/* Payment icons */}
                    <SlotCard slot={BADGE_SLOTS[1]} imageUrl={getImg(BADGE_SLOTS[1].index)}
                      onUpload={f => handleSlot(BADGE_SLOTS[1].index, f)} onRemove={() => removeImg(BADGE_SLOTS[1].index)} />
                  </div>

                  {/* Review-only special slots */}
                  {isReview && (
                    <>
                      <SectionLabel>Review — secções especiais</SectionLabel>
                      <div style={{ background: '#F0F9FF', border: '1px solid #BAE6FD', borderRadius: '8px', padding: '8px 12px', marginBottom: '10px' }}>
                        <div style={{ fontSize: '11px', color: '#0369A1', fontWeight: 600 }}>
                          Slots opcionais — se não carregar, a secção aparece só com texto
                        </div>
                      </div>
                      <div style={slotGrid}>
                        {REVIEW_EXTRA_SLOTS.map(s => (
                          <SlotCard key={s.index} slot={s} imageUrl={getImg(s.index)}
                            onUpload={f => handleSlot(s.index, f)} onRemove={() => removeImg(s.index)} />
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
                          <FieldLabel optional>Ângulo específico</FieldLabel>
                          <FormControl><input placeholder="Ex: Focar em mulheres 40+ com energia baixa" {...field} style={inputStyle} onFocus={focusIn} onBlur={focusOut} /></FormControl>
                        </FormItem>
                      )} />
                      <div>
                        <FieldLabel optional>Persona</FieldLabel>
                        <input placeholder="Ex: Mãe, 45 anos, trabalha fora" style={inputStyle} onFocus={focusIn} onBlur={focusOut} />
                      </div>
                    </div>
                    <FormField control={form.control} name="clarityScript" render={({ field }) => (
                      <FormItem>
                        <FieldLabel optional>Clarity insights</FieldLabel>
                        <FormControl>
                          <textarea placeholder={`Ex: usuários não estão clicando no botão CTA\nvisitantes não chegam à seção de preço`} rows={3} {...field}
                            style={{ width: '100%', borderRadius: '8px', border: '1px solid #E5E7EB', fontSize: '13px', color: '#0F172A', padding: '8px 10px', outline: 'none', background: '#fff', boxSizing: 'border-box' as const, resize: 'vertical' as const, fontFamily: 'inherit' }}
                            onFocus={focusIn} onBlur={focusOut} />
                        </FormControl>
                      </FormItem>
                    )} />
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

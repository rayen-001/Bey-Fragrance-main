import { useState, useEffect, useCallback, useMemo } from 'react';
import { motion } from 'motion/react';
import { Link2, Plus, X, Search, Copy, Check, ExternalLink, Edit2, Trash2, Power, AlertTriangle, Package } from 'lucide-react';
import { Button } from './ui/button';
import { offersApi } from '../lib/api';
import type { Product, OfferSummary } from '../types';

const MAX_PRODUCTS = 10;

interface AdminOfferLinksProps {
  products: Product[];
  loadingProducts: boolean;
}

// "Scandal + 1 Million" -> "scandal-1-million"
const toSlug = (text: string) =>
  text
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 60)
    .replace(/-+$/, '');

const offerUrl = (slug: string) => `${window.location.origin}/offer/${slug}`;

// Products without a photo or sizes look empty on the landing page
const productWarnings = (product?: Product) => {
  if (!product) return ['no longer exists'];
  const warnings: string[] = [];
  if (!product.mainImage) warnings.push('no photo');
  if (!product.shippingMethods || product.shippingMethods.length === 0) warnings.push('no sizes');
  return warnings;
};

// src/index.css is a precompiled Tailwind build: only classes already in it work,
// so anything missing from it is written as an inline style below.
const inputClass = 'w-full bg-white/5 border border-white/10 rounded-sm px-4 py-3 text-white focus:outline-none focus:border-[#d4af37]/50';
const actionBase = 'flex items-center gap-2 px-3 py-2 border border-white/10 rounded-sm text-white/70 text-xs transition-colors disabled:opacity-50';
const actionClass = `${actionBase} hover:text-[#d4af37] hover:border-[#d4af37]/50`;
const AMBER = '#fbbf24';

function ProductThumb({ src }: { src: string | null | undefined }) {
  const size = { width: 40, height: 48 };
  return src ? (
    <img src={src} alt="" style={size} className="object-cover rounded-sm bg-white/5 flex-shrink-0" />
  ) : (
    <div style={size} className="rounded-sm bg-white/5 flex items-center justify-center flex-shrink-0">
      <Package size={16} className="text-white/30" />
    </div>
  );
}

export default function AdminOfferLinks({ products, loadingProducts }: AdminOfferLinksProps) {
  const [offers, setOffers] = useState<OfferSummary[]>([]);
  const [loading, setLoading] = useState(true);
  const [listError, setListError] = useState('');
  const [busyId, setBusyId] = useState<string | null>(null);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  // Form state
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [title, setTitle] = useState('');
  const [slug, setSlug] = useState('');
  const [slugEdited, setSlugEdited] = useState(false);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [search, setSearch] = useState('');
  const [formError, setFormError] = useState('');
  const [saving, setSaving] = useState(false);

  const productsById = useMemo(() => new Map(products.map(p => [p.id, p])), [products]);

  // ── Data Fetching ─────────────────────────────────────────
  const fetchOffers = useCallback(async () => {
    setLoading(true);
    setListError('');
    try {
      setOffers(await offersApi.getAll());
    } catch (err: any) {
      setListError(err.message || 'Failed to load offer links');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchOffers();
  }, [fetchOffers]);

  const searchResults = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return [];
    return products
      .filter(p => !selectedIds.includes(p.id))
      .filter(p => p.name.toLowerCase().includes(q) || (p.inspiredBy || '').toLowerCase().includes(q))
      .slice(0, 8);
  }, [search, products, selectedIds]);

  const hasWarnings = selectedIds.some(id => productWarnings(productsById.get(id)).length > 0);

  // ── Form Handlers ─────────────────────────────────────────
  const openCreate = () => {
    setEditingId(null);
    setTitle('');
    setSlug('');
    setSlugEdited(false);
    setSelectedIds([]);
    setSearch('');
    setFormError('');
    setShowForm(true);
  };

  const openEdit = (offer: OfferSummary) => {
    setEditingId(offer.id);
    setTitle(offer.title);
    setSlug(offer.slug);
    setSlugEdited(true);
    setSelectedIds(offer.products.map(p => p.id));
    setSearch('');
    setFormError('');
    setShowForm(true);
  };

  const closeForm = () => {
    if (!saving) setShowForm(false);
  };

  const handleTitleChange = (value: string) => {
    setTitle(value);
    if (!slugEdited) setSlug(toSlug(value));
    setFormError('');
  };

  const addProduct = (id: string) => {
    if (selectedIds.length >= MAX_PRODUCTS) {
      setFormError(`Pick at most ${MAX_PRODUCTS} products`);
      return;
    }
    setSelectedIds(prev => [...prev, id]);
    setSearch('');
    setFormError('');
  };

  const removeProduct = (id: string) => {
    setSelectedIds(prev => prev.filter(x => x !== id));
    setFormError('');
  };

  const handleSave = async () => {
    const cleanSlug = toSlug(slug);
    if (!title.trim()) {
      setFormError('Enter a title');
      return;
    }
    if (cleanSlug.length < 2) {
      setFormError('Enter a link name (at least 2 letters or numbers)');
      return;
    }
    if (selectedIds.length === 0) {
      setFormError('Pick at least one product');
      return;
    }

    setSaving(true);
    setFormError('');
    try {
      const payload = { title: title.trim(), slug: cleanSlug, productIds: selectedIds };
      if (editingId) {
        await offersApi.update(editingId, payload);
      } else {
        await offersApi.create(payload);
      }
      setShowForm(false);
      await fetchOffers();
    } catch (err: any) {
      setFormError(err.message || 'Failed to save the link');
    } finally {
      setSaving(false);
    }
  };

  // ── List Handlers ─────────────────────────────────────────
  const handleCopy = async (offer: OfferSummary) => {
    const url = offerUrl(offer.slug);
    try {
      await navigator.clipboard.writeText(url);
      setCopiedId(offer.id);
      setTimeout(() => setCopiedId(current => (current === offer.id ? null : current)), 2000);
    } catch {
      window.prompt('Copy this link:', url);
    }
  };

  const handleToggle = async (offer: OfferSummary) => {
    setBusyId(offer.id);
    try {
      await offersApi.update(offer.id, { isActive: !offer.isActive });
      setOffers(prev => prev.map(o => (o.id === offer.id ? { ...o, isActive: !o.isActive } : o)));
    } catch (err: any) {
      alert(err.message || 'Failed to update the link');
    } finally {
      setBusyId(null);
    }
  };

  const handleDelete = async (offer: OfferSummary) => {
    if (!window.confirm(`Delete the link "${offer.title}"?\n\nOrders that came from it stay in Orders.`)) return;
    setBusyId(offer.id);
    try {
      await offersApi.delete(offer.id);
      setOffers(prev => prev.filter(o => o.id !== offer.id));
    } catch (err: any) {
      alert(err.message || 'Failed to delete the link');
    } finally {
      setBusyId(null);
    }
  };

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
      <div className="flex items-center justify-between mb-2 gap-3 min-w-0">
        <h2 className="text-2xl text-white font-serif truncate">Offer Links</h2>
        <Button
          variant="primary"
          onClick={openCreate}
          className="flex items-center gap-2 px-4 py-3 text-xs flex-shrink-0"
        >
          <Plus size={14} />
          New Link
        </Button>
      </div>
      <p className="text-white/50 text-sm mb-8">
        Pick products, share the link in your ads, and see how many people visit and order.
      </p>

      {loading ? (
        <div className="bg-white/5 border border-white/10 rounded-sm p-12 text-center">
          <p className="text-white/50">Loading offer links...</p>
        </div>
      ) : listError ? (
        <div className="bg-white/5 border border-red-500/30 rounded-sm p-12 text-center">
          <p className="text-red-400 mb-4">{listError}</p>
          <button onClick={fetchOffers} className={`${actionClass} mx-auto`}>Retry</button>
        </div>
      ) : offers.length === 0 ? (
        <div className="bg-white/5 border border-white/10 rounded-sm p-12 text-center">
          <Link2 size={48} className="mx-auto mb-4 text-white/30" />
          <p className="text-white mb-1">Create your first offer link</p>
          <p className="text-white/50 text-sm">Pick a few products and get one link to put in your ads.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {offers.map(offer => {
            const conversion = offer.visitCount > 0
              ? `${((offer.orderCount / offer.visitCount) * 100).toFixed(1)}%`
              : '—';
            const busy = busyId === offer.id;

            return (
              <div
                key={offer.id}
                style={offer.isActive ? undefined : { opacity: 0.7 }}
                className={`bg-white/5 border rounded-sm p-4 ${offer.isActive ? 'border-white/10' : 'border-white/5'}`}
              >
                <div className="flex flex-col md:flex-row md:items-center gap-4 min-w-0">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1 min-w-0">
                      <h3 className="text-white font-serif text-lg truncate">{offer.title}</h3>
                      <span
                        style={{ fontSize: 10, ...(offer.isActive ? { backgroundColor: 'rgba(34, 197, 94, 0.1)' } : {}) }}
                        className={`uppercase tracking-wider px-2 py-0.5 rounded-sm flex-shrink-0 ${offer.isActive ? 'text-green-400' : 'bg-white/10 text-white/50'}`}
                      >
                        {offer.isActive ? 'Active' : 'Off'}
                      </span>
                    </div>
                    <p className="text-[#d4af37] text-xs truncate mb-2">{offerUrl(offer.slug)}</p>
                    <p className="text-white/50 text-xs truncate">
                      {offer.products.map(p => p.name).join(' · ') || 'No products'}
                    </p>
                  </div>

                  <div className="grid gap-4 text-center flex-shrink-0" style={{ gridTemplateColumns: 'repeat(3, minmax(0, 1fr))' }}>
                    <div>
                      <div className="text-white text-lg">{offer.visitCount.toLocaleString()}</div>
                      <div className="text-white/40 text-xs">Visits</div>
                    </div>
                    <div>
                      <div className="text-white text-lg">{offer.orderCount.toLocaleString()}</div>
                      <div className="text-white/40 text-xs">Orders</div>
                    </div>
                    <div>
                      <div className="text-[#d4af37] text-lg">{conversion}</div>
                      <div className="text-white/40 text-xs">Conversion</div>
                    </div>
                  </div>

                  <div className="flex flex-wrap gap-2 flex-shrink-0">
                    <button onClick={() => handleCopy(offer)} className={actionClass}>
                      {copiedId === offer.id ? <Check size={14} /> : <Copy size={14} />}
                      {copiedId === offer.id ? 'Copied' : 'Copy'}
                    </button>
                    <a href={offerUrl(offer.slug)} target="_blank" rel="noopener noreferrer" className={actionClass}>
                      <ExternalLink size={14} />
                      Open
                    </a>
                    <button onClick={() => handleToggle(offer)} disabled={busy} className={actionClass}>
                      <Power size={14} />
                      {offer.isActive ? 'Turn off' : 'Turn on'}
                    </button>
                    <button onClick={() => openEdit(offer)} disabled={busy} className={actionClass} aria-label="Edit link">
                      <Edit2 size={14} />
                    </button>
                    <button onClick={() => handleDelete(offer)} disabled={busy} className={`${actionBase} hover:text-red-400`} aria-label="Delete link">
                      <Trash2 size={14} />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Create/Edit Link Modal */}
      {showForm && (
        <motion.div
          className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4 overflow-y-auto"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          <motion.div
            className="bg-[#1a1a1a] border border-white/20 rounded-sm p-6 max-w-2xl w-full max-h-[90vh] overflow-y-auto my-8"
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
          >
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-2xl text-white font-serif">{editingId ? 'Edit Link' : 'New Offer Link'}</h3>
              <button onClick={closeForm} className="text-white/50 hover:text-white transition-colors" aria-label="Close">
                <X size={24} />
              </button>
            </div>

            <div className="space-y-6">
              {/* Title */}
              <div>
                <label className="text-white/70 text-sm mb-2 block">Title *</label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => handleTitleChange(e.target.value)}
                  className={inputClass}
                  placeholder="Scandal + 1 Million"
                  maxLength={120}
                />
              </div>

              {/* Link name */}
              <div>
                <label className="text-white/70 text-sm mb-2 block">Link name *</label>
                <div className="flex min-w-0">
                  <span
                    style={{ borderRight: 0, whiteSpace: 'nowrap' }}
                    className="hidden sm:flex items-center px-3 bg-white/5 border border-white/10 text-white/40 text-xs"
                  >
                    {window.location.host}/offer/
                  </span>
                  <input
                    type="text"
                    value={slug}
                    onChange={(e) => {
                      setSlug(e.target.value.toLowerCase());
                      setSlugEdited(true);
                      setFormError('');
                    }}
                    onBlur={() => setSlug(toSlug(slug))}
                    className={`${inputClass} min-w-0`}
                    placeholder="scandal-1-million"
                    maxLength={60}
                  />
                </div>
                <p className="text-white/40 text-xs mt-2">Letters, numbers and dashes. Changing it later breaks links already shared in ads.</p>
              </div>

              {/* Products */}
              <div>
                <label className="text-white/70 text-sm mb-2 block">
                  Products * <span className="text-white/40">({selectedIds.length}/{MAX_PRODUCTS})</span>
                </label>

                {selectedIds.length > 0 && (
                  <div className="space-y-2 mb-3">
                    {selectedIds.map((id, index) => {
                      const product = productsById.get(id);
                      const warnings = productWarnings(product);
                      return (
                        <div key={id} className="flex items-center gap-3 bg-white/5 border border-white/10 rounded-sm p-2 min-w-0">
                          <span className="text-white/30 text-xs w-4 text-center flex-shrink-0">{index + 1}</span>
                          <ProductThumb src={product?.mainImage} />
                          <div className="flex-1 min-w-0">
                            <div className="text-white text-sm truncate">{product?.name || 'Unknown product'}</div>
                            {warnings.length > 0 && (
                              <div style={{ color: AMBER }} className="text-xs flex items-center gap-1">
                                <AlertTriangle size={12} className="flex-shrink-0" />
                                {warnings.join(', ')}
                              </div>
                            )}
                          </div>
                          <button onClick={() => removeProduct(id)} className="text-white/40 hover:text-red-400 transition-colors p-1" aria-label="Remove product">
                            <X size={16} />
                          </button>
                        </div>
                      );
                    })}
                  </div>
                )}

                <div className="relative">
                  <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-white/30" size={18} />
                  <input
                    type="text"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className={`${inputClass} pl-12`}
                    placeholder={loadingProducts ? 'Loading products...' : 'Search products to add'}
                    disabled={loadingProducts}
                  />
                </div>

                {search.trim() && (
                  <div className="mt-2 border border-white/10 rounded-sm">
                    {searchResults.length === 0 ? (
                      <p className="text-white/40 text-sm p-3">No matching products</p>
                    ) : (
                      searchResults.map(product => {
                        const warnings = productWarnings(product);
                        return (
                          <button
                            key={product.id}
                            onClick={() => addProduct(product.id)}
                            className="w-full flex items-center gap-3 p-2 text-left border-b border-white/5 hover:bg-white/5 transition-colors min-w-0"
                          >
                            <ProductThumb src={product.mainImage} />
                            <div className="flex-1 min-w-0">
                              <div className="text-white text-sm truncate">{product.name}</div>
                              <div className="text-white/40 text-xs truncate">
                                {warnings.length > 0 ? (
                                  <span style={{ color: AMBER }}>{warnings.join(', ')}</span>
                                ) : (
                                  product.inspiredBy || product.category || ''
                                )}
                              </div>
                            </div>
                            <Plus size={16} className="text-[#d4af37] flex-shrink-0" />
                          </button>
                        );
                      })
                    )}
                  </div>
                )}

                {hasWarnings && (
                  <p style={{ color: AMBER, opacity: 0.8 }} className="text-xs mt-3 flex items-start gap-2">
                    <AlertTriangle size={14} style={{ marginTop: 1 }} className="flex-shrink-0" />
                    Products without a photo or sizes will look empty on the offer page.
                  </p>
                )}
              </div>

              {formError && (
                <div className="p-3 bg-red-500/10 border border-red-500/30 rounded-sm">
                  <p className="text-red-400 text-sm">{formError}</p>
                </div>
              )}

              <div className="flex gap-3 pt-2">
                <Button variant="outline" onClick={closeForm} disabled={saving} className="flex-1 px-6 py-3 text-sm">
                  Cancel
                </Button>
                <Button variant="primary" onClick={handleSave} disabled={saving} className="flex-1 px-6 py-3 text-sm">
                  {saving ? 'Saving...' : editingId ? 'Save Changes' : 'Create Link'}
                </Button>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </motion.div>
  );
}

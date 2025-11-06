import { coupon, db } from "@/lib/firebase"
import { collection, doc, onSnapshot, updateDoc, deleteDoc, Timestamp } from "firebase/firestore"
import Image from "next/image"
import { motion, AnimatePresence } from "framer-motion"
import { Calendar, Coins, Edit2, Package, Percent, Save, Trash2, X } from "lucide-react"
import { useEffect, useState } from "react"

function DiscountBox({percentage}:{percentage:number}) {
    return (
      <div className="flex items-center justify-center w-auto h-full bg-gradient-to-br from-[#0A0015] via-[#260547] to-[#490e77] rounded-2xl">
        <span className="text-4xl font-extrabold bg-gradient-to-r from-[#A86FFF] to-[#FF6F91] text-transparent bg-clip-text">
          -{percentage}%
        </span>
      </div>
    );
  }

export default function CouponList(){
    const [coupons, setCoupons] = useState<coupon[]>([])
    const [editingCoupon, setEditingCoupon] = useState<any>(null)
    
    async function getCoupons(){
        try {
            
            const unsub = onSnapshot(collection(db, "coupons"), (snapshot) => {
                const data = snapshot.docs.map((doc) => doc.data() as coupon)
                setCoupons(data)
            })
        } catch (error) {
            console.log(error)
        }
    }
    
    useEffect(()=>{
        getCoupons();
    },[])
    
    const handleDeleteCoupon = async (id: string) => {
        try {
            await deleteDoc(doc(db, "coupons", id))
            console.log("Coupon deleted successfully")
        } catch (error) {
            console.error("Error deleting coupon:", error)
        }
    }
    
    const handleEditCoupon = (coupon: coupon) => {
        const expiryDate = coupon.expiryDate && typeof coupon.expiryDate.toDate === 'function'
            ? coupon.expiryDate.toDate().toISOString().slice(0, 16)
            : "";
      
        setEditingCoupon({
          ...coupon,
          expiryDate,
          pointsCost: coupon.pointsCost.toString(),
          discountAmount: coupon.discountamount?.toString() || "",
          minimalPrice: coupon.minimalPrice?.toString() || "",
        });
    };
    
    const handleSaveEdit = async () => {
        if(!editingCoupon) return;
        
        try {
            const couponRef = doc(db, "coupons", editingCoupon.id.toString())
            
            const updateData: any = {
                name: editingCoupon.name,
                category: editingCoupon.category,
                description: editingCoupon.description,
                pointsCost: Number.parseInt(editingCoupon.pointsCost),
                expiryDate: Timestamp.fromDate(new Date(editingCoupon.expiryDate)),
            }
            
            if (editingCoupon.isDiscount) {
                updateData.discountAmount = Number.parseInt(editingCoupon.discountAmount)
                updateData.minimalPrice = Number.parseInt(editingCoupon.minimalPrice)
            } else {
                updateData.imageUrl = editingCoupon.imageUrl
            }
        
            await updateDoc(couponRef, updateData)
            
            console.log("Coupon updated successfully")
            setEditingCoupon(null)
        } catch (error) {
            console.error("Error updating coupon:", error)
        }
    }
    
    return (
        <>
            <motion.div
                key="manage"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="space-y-4"
            >
                {coupons.map((coupon) => (
                    <motion.div
                        key={coupon.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="bg-white/10 backdrop-blur-xl rounded-2xl p-6 border border-white/20 hover:bg-white/15 transition-all"
                    >
                        <div className="flex items-start gap-4">
                            {/* Image */}
                            <div className="w-24 h-24 rounded-xl overflow-hidden bg-white/5 flex-shrink-0">
                                {coupon.isDiscount ? (
                                    <DiscountBox percentage={coupon.discountamount || 0} />
                                ) : (
                                    <Image 
                                        src={coupon.imageUrl || ""}
                                        alt={coupon.name}
                                        width={96}
                                        height={96}
                                        className="w-full h-full object-cover"
                                    />                
                                )}
                            </div>

                            {/* Info */}
                            <div className="flex-1">
                                <div className="flex items-start justify-between mb-2">
                                    <div>
                                        <h3 className="text-xl font-bold text-white mb-1">{coupon.name}</h3>
                                        <p className="text-white/70 text-sm">{coupon.description}</p>
                                    </div>
                                    <div className="flex gap-2">
                                        <motion.button
                                            whileHover={{ scale: 1.1 }}
                                            whileTap={{ scale: 0.9 }}
                                            onClick={() => handleEditCoupon(coupon)}
                                            className="p-2 bg-blue-500/20 hover:bg-blue-500/30 rounded-lg border border-blue-400/30 transition-all"
                                        >
                                            <Edit2 className="w-4 h-4 text-blue-300" />
                                        </motion.button>
                                        <motion.button
                                            whileHover={{ scale: 1.1 }}
                                            whileTap={{ scale: 0.9 }}
                                            onClick={() => handleDeleteCoupon(coupon.id)}
                                            className="p-2 bg-red-500/20 hover:bg-red-500/30 rounded-lg border border-red-400/30 transition-all"
                                        >
                                            <Trash2 className="w-4 h-4 text-red-300" />
                                        </motion.button>
                                    </div>
                                </div>

                                <div className="flex items-center gap-4 text-sm">
                                    <div className="flex items-center gap-1 text-purple-300">
                                        <Coins className="w-4 h-4" />
                                        <span className="font-bold">{coupon.pointsCost} punktów</span>
                                    </div>
                                    <div className="flex items-center gap-1 text-pink-300">
                                        <Calendar className="w-4 h-4 text-white" />
                                        <span>
                                            Wygasa:{" "}
                                            {coupon.expiryDate && typeof coupon.expiryDate.toDate === 'function'
                                                ? coupon.expiryDate.toDate().toLocaleDateString("pl-PL")
                                                : "Brak daty"}
                                        </span>
                                    </div>
                                    {coupon.isDiscount && coupon.discountamount && (
                                        <div className="px-3 py-1 bg-green-500/20 border border-green-400/30 rounded-full text-green-300 text-xs font-bold">
                                            -{coupon.discountamount}%
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    </motion.div>
                ))}

                {coupons.length === 0 && (
                    <div className="text-center py-12 text-white/50">
                        <Package className="w-16 h-16 mx-auto mb-4 opacity-30" />
                        <p>Brak dostępnych kuponów</p>
                    </div>
                )}
            </motion.div>
            
            <AnimatePresence>
                {editingCoupon && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4"
                        onClick={() => setEditingCoupon(null)}
                    >
                        <motion.div
                            initial={{ scale: 0.9, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0.9, opacity: 0 }}
                            onClick={(e) => e.stopPropagation()}
                            className="bg-gradient-to-br from-purple-900 to-pink-900 rounded-3xl p-8 max-w-2xl w-full max-h-[90vh] overflow-y-auto border border-white/20"
                        >
                            <div className="flex items-center justify-between mb-6">
                                <h2 className="text-2xl font-bold text-white">Edytuj Kupon</h2>
                                <button
                                    onClick={() => setEditingCoupon(null)}
                                    className="p-2 hover:bg-white/10 rounded-lg transition-all"
                                >
                                    <X className="w-6 h-6 text-white" />
                                </button>
                            </div>

                            <div className="space-y-4">
                                <div>
                                    <label className="block text-white font-medium mb-2">Nazwa</label>
                                    <input
                                        type="text"
                                        value={editingCoupon.name}
                                        onChange={(e) => setEditingCoupon({ ...editingCoupon, name: e.target.value })}
                                        className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                                    />
                                </div>

                                <div>
                                    <label className="block text-white font-medium mb-2">Kategoria</label>
                                    <input
                                        type="text"
                                        value={editingCoupon.category}
                                        onChange={(e) => setEditingCoupon({ ...editingCoupon, category: e.target.value })}
                                        className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                                    />
                                </div>

                                <div>
                                    <label className="block text-white font-medium mb-2">Opis</label>
                                    <textarea
                                        value={editingCoupon.description}
                                        onChange={(e) => setEditingCoupon({ ...editingCoupon, description: e.target.value })}
                                        rows={3}
                                        className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-purple-500 resize-none"
                                    />
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-white font-medium mb-2">Koszt punktów</label>
                                        <input
                                            type="number"
                                            value={editingCoupon.pointsCost}
                                            onChange={(e) => setEditingCoupon({ ...editingCoupon, pointsCost: e.target.value })}
                                            className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                                        />
                                    </div>

                                    {editingCoupon.isDiscount && (
                                        <div>
                                            <label className="block text-white font-medium mb-2">Zniżka (%)</label>
                                            <input
                                                type="number"
                                                value={editingCoupon.discountAmount}
                                                onChange={(e) => setEditingCoupon({ ...editingCoupon, discountAmount: e.target.value })}
                                                className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                                            />
                                        </div>
                                    )}
                                </div>

                                {editingCoupon.isDiscount && (
                                    <div>
                                        <label className="block text-white font-medium mb-2">Minimalna cena</label>
                                        <input
                                            type="number"
                                            value={editingCoupon.minimalPrice}
                                            onChange={(e) => setEditingCoupon({ ...editingCoupon, minimalPrice: e.target.value })}
                                            className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                                        />
                                    </div>
                                )}

                                <div>
                                    <label className="block text-white font-medium mb-2">Data wygaśnięcia</label>
                                    <input
                                        type="datetime-local"
                                        value={editingCoupon.expiryDate}
                                        onChange={(e) => setEditingCoupon({ ...editingCoupon, expiryDate: e.target.value })}
                                        className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                                    />
                                </div>
                                
                                {!editingCoupon.isDiscount && (
                                    <div>
                                        <label className="block text-white font-medium mb-2">URL zdjęcia</label>
                                        <input
                                            type="url"
                                            value={editingCoupon.imageUrl}
                                            onChange={(e) => setEditingCoupon({ ...editingCoupon, imageUrl: e.target.value })}
                                            className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                                        />
                                    </div>
                                )}

                                <motion.button
                                    whileHover={{ scale: 1.02 }}
                                    whileTap={{ scale: 0.98 }}
                                    onClick={handleSaveEdit}
                                    className="w-full mt-6 px-6 py-4 bg-gradient-to-r from-purple-600 to-pink-600 text-white font-semibold rounded-lg hover:shadow-lg hover:shadow-purple-500/50 transition-all flex items-center justify-center gap-2"
                                >
                                    <Save className="w-5 h-5" />
                                    Zapisz zmiany
                                </motion.button>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </>
    )
}
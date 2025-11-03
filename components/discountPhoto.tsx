export default function DiscountBox({percentage}:{percentage:number}) {
    return (
      <div className="flex items-center justify-center w-48 h-40  bg-gradient-to-br from-[#0A0015] via-[#260547] to-[#490e77] rounded-2xl">
        <span className="text-[70px] font-extrabold bg-gradient-to-r from-[#A86FFF] to-[#FF6F91] text-transparent bg-clip-text">
          -{percentage}%
        </span>
      </div>
    );
  }
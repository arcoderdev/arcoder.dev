import Blob from "@assets/projects/blob.svg";

export default function Shadows() {
    const blobSrc = typeof Blob === "string" ? Blob : (Blob as any)?.src || Blob;

    return (
        <div class="absolute inset-0 w-full h-full overflow-x-clip -z-[2]">
            <img
                src={blobSrc}
                alt="Blob 1"
                class="absolute aspect-364/464 w-[364px] h-auto -top-50 -left-30 z-[-2] pointer-events-none select-none blur-[150px]"
            />
            <img
                src={blobSrc}
                alt="Blob 2"
                class="absolute aspect-364/464 w-[364px] top-70 -right-50 h-auto z-[-2] pointer-events-none select-none blur-[150px]"
            />
        </div>
    );
}

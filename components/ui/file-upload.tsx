'use client';

import { UploadDropzone } from "@/lib/uploadthing";
import { X } from "lucide-react";
import Image from "next/image";
import "@uploadthing/react/styles.css";

interface FileUploadProps {
    onChange: (url?: string) => void;
    value: string;
    endpoint: 'messageMedia' | 'serverImage'
}

const FileUpload = ({onChange, value, endpoint}: FileUploadProps) => {


    const fileType = value?.split('.').pop()

    if(value && fileType !== 'pdf' && endpoint == 'serverImage'){
        return (
            <div className="relative h-32 w-32 mx-auto">
                <Image
                fill
                src={value}
                alt='Your Server Icon'
                className='rounded-full'
                />
                <button
                onClick={() => onChange('')}
                className="bg-rose-500 text-white p-1 rounded-full absolute top-0 right-0 shadow-sm"
                type='button'>
                <X className='h-6 w-6' />
                </button>
            </div>
        )
    }

    return (
        <UploadDropzone
            className="p-0 gap-4 cursor-pointer"
            endpoint={endpoint}
            onClientUploadComplete={(res) => {
                onChange(res?.[0].url)
            }}
            onUploadError={(error:Error) => {
                console.log(error)
            }}
        />
     );
}

export default FileUpload;

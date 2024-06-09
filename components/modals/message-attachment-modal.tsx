'use client';

import * as z from 'zod';
import axios from 'axios'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from "react-hook-form"
import { Input } from "@/components/ui/input"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
    DialogFooter
} from "@/components/ui/dialog"
import {
    Form,
    FormControl,
    FormDescription,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form"
import { Button } from '@/components/ui/button';
import FileUpload from '../ui/file-upload';
import { useEffect, useState } from "react";
import { useRouter } from 'next/navigation';
import { useModal } from '@/app/hooks/user-modal-store';

/************************************************/
// error checking schema
const formSchema = z.object({
        name: z.string().min(2, {
        message: "Server name must be more than 2 characters long",
    }),
        imageUrl: z.string().min(2, {
        message: "Server image must be more than 2 characters long",
    }),
})

/*************************************************/

const MessageAttachmentModal = (onImageUpload: any) => {
    const { type, isOpen, onClose, data } = useModal();
    const isModalOpen = isOpen && type === "messageFile";
    const router = useRouter()

    const form = useForm({
        resolver: zodResolver(formSchema),
        defaultValues: {
            name: '',
            imageUrl: '',
        }
    })

    const isLoading = form.formState.isSubmitting;

    const onSubmit = async () => {
        try {
            // Handle your form submission logic here
            form.reset();
            router.refresh();
            window.location.reload();
        } catch (error) {
            console.log(error);
        }
    };

    // const onSubmit = async (values: z.infer<typeof formSchema>) => {
    //     try{
    //         await fetch('/api/servers', {
    //             method: 'POST',
    //             headers: {
    //                 'Content-Type': 'application/json'
    //             },
    //             body: JSON.stringify(values),
    //         })
    //         form.reset();
    //         router.refresh()
    //         window.location.reload()
    //     } catch (error) {
    //         console.log(error)
    //     }
    // }


    const closeModal = () => {
        onClose()
    }

    return (
            <Dialog open={isModalOpen} onOpenChange={closeModal}>
                <DialogTrigger>fdfd</DialogTrigger>
                <DialogContent className='text-gray-200 overflow-hidden'>
                    <DialogHeader className='pt-8 px-6'>
                        <DialogTitle className=' text-gray-700 text-4xl text-center'>
                            Attach a File
                        </DialogTitle>
                        <DialogDescription className='text-center py-4'>
                            You can add pictures, gifs, video/webms, and pdfs galore!
                        </DialogDescription>
                        <Form {...form}>
                            <form onSubmit={form.handleSubmit(onSubmit)}>
                                <div>
                                    <div className='flex justify-center items-center text-center'>
                                        <FormField
                                        control={form.control}
                                        name='imageUrl'
                                        render={({field}) => (
                                            <FormItem className='pb-4'>
                                                <FormLabel className='text-xl pb-4 uppercase text-slate-700'>Your File</FormLabel>
                                                <FormControl>
                                                    <FileUpload
                                                    endpoint='messageMedia'
                                                    value={field.value}
                                                    // this sends the image url plus function you upload to the chat input component and then closes the modal
                                                    onChange={(url) => {
                                                        field.onChange(url);
                                                        if (data.onImageUpload) {
                                                            data.onImageUpload(url);
                                                        }
                                                        closeModal();
                                                    }}
                                                    />
                                                </FormControl>
                                            </FormItem>
                                        )} />
                                    </div>
                                </div>
                            </form>
                        </Form>
                    </DialogHeader>
                </DialogContent>
            </Dialog>
    );
}

export default MessageAttachmentModal;

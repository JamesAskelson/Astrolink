'use client';

import * as z from 'zod';
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from "react-hook-form"
import { Input } from "@/components/ui/input"
import { Button } from '@/components/ui/button';
import FileUpload from '../ui/file-upload';
import { useRouter } from 'next/navigation';
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
import { useModal } from '@/app/hooks/user-modal-store';
import { useEffect } from 'react';

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

export const ServerSettingsModal = () => {
    const { type, isOpen, onClose, data } = useModal();
    const router = useRouter()
    const { server } = data;
    const isModalOpen = isOpen && type === "serverSettings";

    const form = useForm({
        resolver: zodResolver(formSchema),
        defaultValues: {
            name: '',
            imageUrl: '',
        }
    })

    useEffect(() => {
        if(server){
            form.setValue('name', server.name)
            form.setValue('imageUrl', server.imageUrl)
        }
    }, [server, form])

    const isLoading = form.formState.isSubmitting;

    const onSubmit = async (values: z.infer<typeof formSchema>) => {
        try{
            await fetch(`/api/servers/${server?.id}`, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(values),
            })
            form.reset();
            router.refresh()
            onClose()
            
        } catch (error) {
            console.log(error)
        }
    }

    const closeModal = () => {
        form.reset()
        onClose()
    }

    return (
            <Dialog open={isModalOpen} onOpenChange={closeModal}>
                <DialogTrigger></DialogTrigger>
                <DialogContent className='text-gray-200 overflow-hidden'>
                    <DialogHeader className='pt-8 px-6'>
                        <DialogTitle className=' text-gray-700 text-4xl text-center'>
                            Customize your server
                        </DialogTitle>
                        <DialogDescription className='text-center py-4'>
                            New to Astrolink? Customize your server with a new name and server image to personalize it to fit your style!
                        </DialogDescription>
                        <Form {...form}>
                            <form onSubmit={form.handleSubmit(onSubmit)}>
                                <div>
                                    {/* <div className='text-center text-2xl text-zinc-500 pb-4'>TODO: ImageUrl</div> */}
                                    <div className='flex justify-center items-center text-center'>
                                        <FormField
                                        control={form.control}
                                        name='imageUrl'
                                        render={({field}) => (
                                            <FormItem className='pb-4'>
                                                <FormLabel className='text-xl pb-4 uppercase text-slate-700'>Server Image</FormLabel>
                                                <FormControl>
                                                    <FileUpload
                                                    endpoint='serverImage'
                                                    value={field.value}
                                                    onChange={field.onChange}
                                                    />
                                                </FormControl>
                                            </FormItem>
                                        )} />
                                    </div>

                                    <FormField
                                    control={form.control}
                                    name='name'
                                    render={({field}) => (
                                        <FormItem>
                                            <FormLabel className='text-xl pb-4 uppercase text-slate-700 '>Server Name</FormLabel>
                                            <FormControl>
                                                <Input
                                                disabled={isLoading}
                                                placeholder='Enter Server Name'
                                                className='bg-slate-800 border-0 focus-visible:ring-0 focus-visible:ring-offset-0'
                                                {...field}
                                                ></Input>
                                            </FormControl>
                                            <FormMessage className=' text-red-500'/>
                                        </FormItem>
                                    )} />
                                </div>
                            <div className='flex justify-center'>
                                <DialogFooter className='py-4'>
                                    <Button className='w-52' variant='primary' disabled={isLoading}>Save</Button>
                                </DialogFooter>
                            </div>
                            </form>
                        </Form>
                    </DialogHeader>
                </DialogContent>
            </Dialog>
    );
}

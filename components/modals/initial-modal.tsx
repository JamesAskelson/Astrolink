'use client';

import * as z from 'zod';
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


const formSchema = z.object({
        name: z.string().min(2, {
        message: "Server name must be more than 2 characters long",
    }),
        imageUrl: z.string().min(2, {
        message: "Server image must be more than 2 characters long",
    }),
})

const InitialModal = () => {
    const form = useForm({
        resolver: zodResolver(formSchema),
        defaultValues: {
            name: '',
            imageUrl: '',
        }
    })

    const isLoading = form.formState.isSubmitting;

    const onSubmit = async (values: z.infer<typeof formSchema>) => {
        console.log(values)
    }

    return (
            <Dialog>
                <DialogTrigger>fdfd</DialogTrigger>
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
                                    <div className='text-center text-2xl text-zinc-500 pb-4'>TODO: ImageUrl</div>
                                    <FormField
                                    control={form.control}
                                    name='name'
                                    render={({field}) => (
                                        <FormItem>
                                            <FormLabel className='text-xl pb-4 uppercase text-slate-700'>Server Name</FormLabel>
                                            <FormControl>
                                                <Input
                                                disabled={isLoading}
                                                placeholder='Enter Server Name'
                                                className='bg-slate-800 border-0 focus-visible:ring-0 focus-visible:ring-offset-0'
                                                {...field}
                                                ></Input>
                                            </FormControl>
                                        </FormItem>
                                    )} />
                                </div>
                            </form>
                            <div className='flex justify-center'>
                                <DialogFooter className='py-4'>
                                    <Button className='w-52' variant='primary' disabled={isLoading}>Create</Button>
                                </DialogFooter>
                            </div>
                        </Form>
                    </DialogHeader>
                </DialogContent>
            </Dialog>
    );
}

export default InitialModal;

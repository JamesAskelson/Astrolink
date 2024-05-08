'use client';

import * as z from 'zod';
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from "react-hook-form"
import { Input } from "@/components/ui/input";
import { Button } from '@/components/ui/button';
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
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
  } from "@/components/ui/select"
import { useModal } from '@/app/hooks/user-modal-store';
import { Channel, ChannelType } from '@prisma/client';
import { ServerWithMembersWithProfiles } from "@/type";
import { useEffect } from 'react';

/************************************************/
// error checking schema

const formSchema = z.object({
        name: z.string().min(2, {
        message: "Channel name is required"
    }).refine(name => name !== 'general',
        {
            message: "Channel name can't be 'general' "
        }
    ),
        type: z.nativeEnum(ChannelType)
    })


/*************************************************/

export const EditChannelModal = () => {
    const { type, isOpen, onClose, data } = useModal();
    const { server } = data;
    const { channel } = data;
    const router = useRouter()


    const isModalOpen = isOpen && type === "editChannel";

    const form = useForm({
        resolver: zodResolver(formSchema),
        defaultValues: {
            name: '',
            type: channel?.type || ChannelType.TEXT,
        }
    })

    useEffect(() => {
        if(channel) {
            form.setValue('type', channel?.type)
            form.setValue('name', channel?.name)
        }
    }, [channel?.type, form, channel])

    const isLoading = form.formState.isSubmitting;

    const onSubmit = async (values: z.infer<typeof formSchema>) => {

        try{
            await fetch(`/api/servers/${server?.id}/channels/${channel?.id}`, {
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
                            Edit Channel
                        </DialogTitle>
                        <DialogDescription className='text-center py-4'>
                            Make any changes to the Channel!
                        </DialogDescription>
                        <Form {...form}>
                            <form onSubmit={form.handleSubmit(onSubmit)}>
                                <div>
                                    <FormField
                                    control={form.control}
                                    name='name'
                                    render={({field}) => (
                                        <FormItem>
                                            <FormLabel className='text-xl pb-4 uppercase text-slate-700 '>Channel Name</FormLabel>
                                            <FormControl>
                                                <Input
                                                disabled={isLoading}
                                                placeholder='Enter Channel Name'
                                                className='bg-slate-800 border-0 focus-visible:ring-0 focus-visible:ring-offset-0'
                                                {...field}
                                                ></Input>
                                            </FormControl>
                                            <FormMessage className=' text-red-500'/>
                                        </FormItem>
                                    )} />
                                    <FormField
                                    control={form.control}
                                    name='type'
                                    render={({field}) => (
                                        <FormItem>
                                            <FormLabel className='text-xl pb-4 uppercase text-slate-700 '>Channel Type</FormLabel>
                                            <Select
                                                disabled={isLoading}
                                                onValueChange={field.onChange}
                                                defaultValue={field.value}

                                            >
                                            <FormControl>
                                                <SelectTrigger className="w-1/2 m-auto">
                                                    <SelectValue placeholder="Select a Channel Type" />
                                                </SelectTrigger>
                                            </FormControl>
                                                <SelectContent>
                                                    {Object.values(ChannelType).map((type) => (
                                                        <SelectItem
                                                            key={type}
                                                            value={type}
                                                            className='capitalize'
                                                        >
                                                            {type.toLowerCase()}
                                                        </SelectItem>
                                                    ))}
                                                </SelectContent>
                                            </Select>

                                            <FormMessage className=' text-red-500'/>
                                        </FormItem>
                                    )} />
                                </div>
                            <div className='flex justify-center'>
                                <DialogFooter className='py-4'>
                                    <Button className='w-52' variant='primary' disabled={isLoading}>Edit</Button>
                                </DialogFooter>
                            </div>
                            </form>
                        </Form>
                    </DialogHeader>
                </DialogContent>
            </Dialog>
    );
}

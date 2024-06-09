'use client'
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { z } from "zod";
import {
    Form,
    FormControl,
    FormDescription,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input";
import { Plus, Smile } from "lucide-react";
import qs from 'query-string'
import { useModal } from "@/app/hooks/user-modal-store";
import { useState } from "react";
import EmojiPicker from "./emoji-picker";


interface ChatInputProps {
    apiUrl: string;
    query: Record<string, any>;
    name: string;
    type: 'channel' | 'conversation';
}

const formSchema = z.object({
    content: z.string().min(1),
    fileUrl: z.string().optional()
})

export const ChatInput = ({apiUrl, name, type, query}: ChatInputProps) => {
    const router = useRouter()
    const { onOpen } = useModal()
    const [urlFile, setUrlFile] = useState('')

    const form = useForm({
        resolver: zodResolver(formSchema),
        defaultValues: {
            content: '',
            fileUrl: ''
        }
    })

    const isLoading = form.formState.isSubmitting;

    const onSubmit = async (values: z.infer<typeof formSchema>) => {
        console.log(values)
        try {
            const url = qs.stringifyUrl({
                url: apiUrl,
                query: query
            })

            const res = await fetch(url, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(values),
            })

            if(res.ok){
                const resData = await res.json()
                form.reset()
                router.refresh()
            }
        } catch(error) {
            console.log(error)
        }
    }

    const handleImageUpload = (url: any) => {
        form.setValue('fileUrl', url); // Update the form with the uploaded image URL
        setUrlFile(url)
    };

    return (
        <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)}>
                    <FormField
                    control={form.control}
                    name='content'
                    render={({field}) => (
                        <FormItem>
                            <FormControl>
                                <div className="relative p-4 pb-6 pr-6">
                                    {urlFile && urlFile.endsWith('.jpg') || urlFile.endsWith('.png') || urlFile.endsWith('.jpeg') || urlFile.endsWith('.gif')  ? (
                                        <img src={urlFile} alt="Uploaded file" className="absolute bottom-20 max-w-20 max-h-20 rounded" />
                                        ) : (
                                        <a href={urlFile} target="_blank" rel="noopener noreferrer" className="text-blue-500 underline absolute bottom-20">
                                            {urlFile}
                                        </a>
                                    )}
                                    <button
                                    type='button'
                                    onClick={() => onOpen('messageFile', { onImageUpload: handleImageUpload })}
                                    className="absolute top-7 left-8 h-[24px] w-[24px] bg-zinc-500 dark:bg-zinc-400 hover:bg-zinc-600
                                    dark:hover:bg-zinc-300 transition rounded-full p-1 flex items-center justify-center">
                                        <Plus />
                                    </button>

                                    <Input
                                    disabled={isLoading}
                                    placeholder={`Message #${name}`}
                                    className='px-14 py-6 bg-slate-800 border-0 focus-visible:ring-0 focus-visible:ring-offset-0'
                                    {...field}
                                    />
                                    <div className="absolute top-7 right-8">
                                        <EmojiPicker onChange={(emoji: string) => field.onChange(`${field.value} ${emoji}`)}/>
                                    </div>
                                </div>
                            </FormControl>
                        </FormItem>
                    )}
                    />
                </form>
        </Form>
    )
}

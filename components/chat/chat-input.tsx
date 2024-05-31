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

interface ChatInputProps {
    apiUrl: string;
    query: Record<string, any>;
    name: string;
    type: 'channel' | 'conversation';
}

const formSchema = z.object({
    content: z.string().min(1),
})

export const ChatInput = ({apiUrl, name, type, query}: ChatInputProps) => {
    const router = useRouter()

    const form = useForm({
        resolver: zodResolver(formSchema),
        defaultValues: {
            content: ''
        }
    })

    const isLoading = form.formState.isSubmitting;

    const onSubmit = async (values: z.infer<typeof formSchema>) => {
        console.log(values)
    }

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
                                    <button
                                    type='button'
                                    onClick={() => console.log('click')}
                                    className="absolute top-7 left-8 h-[24px] w-[24px] bg-zinc-500 dark:bg-zinc-400 hover:bg-zinc-600
                                    dark:hover:bg-zinc-300 transition rounded-full p-1 flex items-center justify-center">
                                        <Plus />
                                    </button>

                                    <Input
                                    disabled={isLoading}
                                    placeholder={`Message #${name}`}
                                    className='px-14 py-6 bg-slate-800 border-0 focus-visible:ring-0 focus-visible:ring-offset-0'
                                    {...field}
                                    >
                                    </Input>
                                    <div                                     className="absolute top-7 right-8">
                                        <Smile />
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

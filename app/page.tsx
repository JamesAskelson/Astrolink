import { Button } from "@/components/ui/button";

export default function Home() {
  return (
    <div className='flex justify-between'>
      <p className=''>Hello to Astrolink</p>
      <Button variant={'destructive'}>
        Click me
      </Button>
    </div>

  );
}

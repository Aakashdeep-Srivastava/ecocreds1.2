import * as React from 'react';
import { Slot } from '@radix-ui/react-slot';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/lib/utils';

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-lg text-sm font-semibold transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [&_svg]:size-4 [&_svg]:shrink-0 active:scale-[0.98]",
  {
    variants: {
      variant: {
        // Brand lime→emerald→teal gradient (primary CTA)
        brand:
          'bg-brand-gradient bg-[length:160%_160%] bg-[position:0%_50%] text-[#07210f] shadow-brand hover:bg-[position:100%_50%] hover:-translate-y-0.5',
        default: 'bg-green-600 text-white hover:bg-green-700',
        secondary: 'bg-white border border-gray-200 text-ink hover:border-green-500 hover:bg-green-50',
        outline: 'border border-gray-200 bg-transparent text-ink hover:bg-gray-50',
        ghost: 'text-ink hover:bg-gray-100',
        destructive: 'bg-error text-white hover:bg-error/90',
        link: 'text-green-600 underline-offset-4 hover:underline',
      },
      size: {
        default: 'h-11 px-5 py-2',
        sm: 'h-9 px-3.5',
        lg: 'h-12 px-7 text-base',
        icon: 'h-10 w-10',
      },
    },
    defaultVariants: { variant: 'default', size: 'default' },
  }
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : 'button';
    return (
      <Comp className={cn(buttonVariants({ variant, size, className }))} ref={ref} {...props} />
    );
  }
);
Button.displayName = 'Button';

export { Button, buttonVariants };

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { COURSE_FAQ } from "@/lib/course";

export function FAQSection() {
  return (
    <Accordion type="single" collapsible className="w-full">
      {COURSE_FAQ.map((item, i) => (
        <AccordionItem key={i} value={`faq-${i}`} className="border-border/60">
          <AccordionTrigger className="text-left font-medium hover:text-primary hover:no-underline">
            {item.q}
          </AccordionTrigger>
          <AccordionContent className="text-muted-foreground leading-relaxed">
            {item.a}
          </AccordionContent>
        </AccordionItem>
      ))}
    </Accordion>
  );
}

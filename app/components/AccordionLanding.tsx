import { Accordion } from "@mantine/core"
import type { AccordionElement as AccordionElementType } from "@/types"
import { uid } from "react-uid"

interface AccordionLandingProps {
  element: AccordionElementType
}

export function AccordionLanding({ element }: AccordionLandingProps) {
  return (
    <Accordion
      variant="separated"
      radius="md"
      defaultValue={element.items?.[0]?.title}
    >
      {element.items?.map((item, idx) => (
        <Accordion.Item value={item.title} key={uid({ ...item, idx })}>
          <Accordion.Control>{item.title}</Accordion.Control>
          <Accordion.Panel>{item.content}</Accordion.Panel>
        </Accordion.Item>
      ))}
    </Accordion>
  )
}

import { Button } from "@orbit-ui/react-button/src";
import { Label, Tag } from "@orbit-ui/react-label/src";
import { createChromaticSection, paramsBuilder, storiesOfBuilder } from "@utils";
import { createSharedStories } from "./shared-stories";
import { isNil } from "lodash";

import styles from "./styles.module.css";

function stories(segment) {
    return storiesOfBuilder(module, createChromaticSection("Button"))
        .segment(segment)
        .parameters(paramsBuilder()
            .canvasLayout({ width: "80%" })
            .chromaticDelay(100)
            .build())
        .build();
}

createSharedStories(<Button />, stories("/standard"));

createSharedStories(<Button primary />, stories("/primary"));

createSharedStories(<Button secondary />, stories("/secondary"));

createSharedStories(<Button positive />, stories("/positive"));

createSharedStories(<Button negative />, stories("/negative"));

createSharedStories(<Button naked />, stories("/naked"))
    .add("coloured",
         () =>
             <div className="flex">
                 <Button
                     className={`${styles.button} mr5`}
                     naked
                     style={{
                         backgroundColor: "#FCD5BC",
                         boxShadow: "0px 0px 0px 1px #FCD003 inset"
                     }}
                 >
                         Button
                 </Button>
                 <Button className={`${styles.button} mr5`} naked active>Button</Button>
                 <Button disabled className={styles.button} naked>Button</Button>
             </div>
    );

function setRedBackground(element) {
    if (!isNil(element)) {
        element.classList.add("bg-red");
    }
}

stories("/label")
    .add("element ref", () =>
        <div className="flex">
            <Button label={<Label ref={setRedBackground}>6</Label>}>Button</Button>
        </div>
    )
    .add("object", () =>
        <div className="flex">
            <Button label={{ content: "6" }} className="mr5">Button</Button>
            <Button label={{ content: "6", className: "bg-red" }} className="mr5">Button</Button>
            <Button label={{ content: "6", ref: setRedBackground }}>Button</Button>
        </div>
    );

stories("/tag")
    .add("element ref", () =>
        <div className="flex">
            <Button tag={<Tag ref={setRedBackground} />}>Button</Button>
        </div>

    )
    .add("object", () =>
        <div className="flex">
            <Button tag={{ className: "bg-red" }} className="mr5">Button</Button>
            <Button tag={{ ref: setRedBackground }}>Button</Button>
        </div>
    );



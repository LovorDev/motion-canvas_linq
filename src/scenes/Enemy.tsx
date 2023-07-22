import {Rect, RectProps, Txt,} from "@motion-canvas/2d/lib/components";
import {Color, PossibleColor, SignalValue} from "@motion-canvas/core";
import {initial, Length, signal} from "@motion-canvas/2d";
import {createRef} from "@motion-canvas/core/lib/utils";
import {createSignal, Signal, SimpleSignal} from "@motion-canvas/core/lib/signals";

export interface  EnemyProps extends RectProps {
    health?: Signal<Length, number, this>;

    backgroundColor?: SignalValue<PossibleColor>;
    
    text?: SignalValue<string>;
    
}
export class  Enemy extends Rect {
    private readonly healthRect = createRef<Rect>();
    
    public constructor(props: EnemyProps) {
        super(props);
        this.add(
            <Rect fill={this.backgroundColor} width="100%" height={this.health} ref={this.healthRect}></Rect>
        );
        this.add(
            <Txt layout={false} text={this.text} fontSize={this.fontSize} fill={this.textColor} position={[16,16]}></Txt>
        )
    }
    
    // @initial - optional, sets the property to an
    // initial value if it was not provided.
    @initial(0)
    // @signal - is required by motion canvas
    // for every prop that was passed in.
    @signal()
    public declare readonly health?: Signal<Length, number, this>;
    
    @initial('#000000')
    // @signal - is required by motion canvas
    // for every prop that was passed in.
    @signal()
    public declare readonly backgroundColor?: SignalValue<PossibleColor>;
    @initial('#000000')
    // @signal - is required by motion canvas
    // for every prop that was passed in.
    @signal()
    public declare readonly textColor?: SignalValue<PossibleColor>;
    
    @initial('')
    @signal()
    public declare readonly text?: SimpleSignal<string>;
    
}
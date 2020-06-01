import { IContextMetadataSnapshot } from "../types";
import { Metadata } from "../Metadata";

export class ContextMetadata extends Metadata<IContextMetadataSnapshot> {
  constructor(props?: Partial<IContextMetadataSnapshot>) {
    super({ ...props, round: 0 });
  }

  public next() {
    const round: number = this.props.get("round");
    this.props = this.props.set("round", round + 1);
    return super.next();
  }
}

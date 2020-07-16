import { IXContextMetadataSnapshot } from "../types";
import { Metadata } from "../Metadata";

export class XContextMetadata extends Metadata<IXContextMetadataSnapshot> {
  constructor(props?: Partial<IXContextMetadataSnapshot>) {
    super({ round: 0, ...props });
  }

  public next() {
    const round: number = this.props.get("round");
    this.props = this.props.set("round", round + 1);
    return super.next();
  }
}

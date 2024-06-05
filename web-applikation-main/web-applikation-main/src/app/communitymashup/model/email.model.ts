import {MetaInformation} from './metainformation.model';
import {CommunityMashupService} from "../communitymashup.service";

export class Email extends MetaInformation {

  // attributes
  address: string;

  constructor(item: { [x: string]: string; }, public override service: CommunityMashupService) {
    super(item, service);
    // attributes
    this.address = item['address'];
  }

}

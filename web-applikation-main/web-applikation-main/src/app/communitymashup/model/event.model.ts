import {MetaInformation} from './metainformation.model';
import {CommunityMashupService} from "../communitymashup.service";

export class Event extends MetaInformation {

  // attributes
  eventDate: string;

  constructor(item: { [x: string]: string; }, public override service: CommunityMashupService) {
    super(item, service);
    // attributes
    this.eventDate = item['date'];
  }

}

import {InformationObject} from './informationobject.model'
import {Organisation} from './organisation.model';
import {Content} from './content.model';
import {CommunityMashupService} from '../communitymashup.service';

export class Person extends InformationObject {

  // additional attributes
  title: string;
  lastname: string;
  firstname: string;
  dateOfBirth: string;
  // additional references
  // leaderOf:Org, authored:Content, contributed:Content, persons:Person, ranked:Ranking

  constructor(item: any, public override service: CommunityMashupService) {
    super(item, service);
    // attributes
    this.title = item['title'];
    this.lastname = item['lastname'];
    this.firstname = item['firstname'];
    this.dateOfBirth = item['dateOfBirth'];
  }

  getLeaderOf(): Organisation {
    // TBD
    return null as any;
  }

  getAuthored(): Content[] {
    // TBD
    return [] as Content[];
  }

  getContributed(): Content[] {
    // TBD
    return [] as Content[];
  }

  getPersons(): Person[] {
    // TBD
    return [] as Person[];
  }

  // TBD: getRanked

}

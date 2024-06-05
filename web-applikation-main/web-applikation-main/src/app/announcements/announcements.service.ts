import { Injectable } from '@angular/core';
import { Announcement } from './announcements';
import { BehaviorSubject, Subject } from 'rxjs';
import { CommunityMashupService } from '../communitymashup/communitymashup.service';
import { Content } from '../communitymashup/model/content.model';
import { Identifier } from '../communitymashup/model/identifier.model';
import { MetaTag } from '../communitymashup/model/metatag.model';
import { Image } from '../communitymashup/model/image.model';
import { Connection } from '../communitymashup/model/connection.model';
import { Person } from '../communitymashup/model/person.model';
import { Organisation } from '../communitymashup/model/organisation.model';
import { Tag } from '../communitymashup/model/tag.model';

@Injectable({
  providedIn: 'root',
})
export class AnnouncementsService {
  private _announcements$ = new BehaviorSubject<Announcement[]>([]);
  private _isLoadingDataFromMashup$ = new Subject<boolean>();

  constructor(private readonly communityMashupService: CommunityMashupService) {
    this.loadAnnouncementsFromMashup();
  }

  get isLoadingDataFromMashup$() {
    return this._isLoadingDataFromMashup$;
  }

  private loadAnnouncementsFromMashup() {
    const announcements: Announcement[] = [];

    this.communityMashupService.loadFromUrl().then(() => {
      const contents: Content[] = this.communityMashupService.getContents(
        'studentannouncement'
      );
      contents.forEach((content) => {
        const identifier: Identifier =
          this.communityMashupService.itemIdMap.get(content.identifiedBy[0]);
        const metaTags: MetaTag[] = [];

        content.metaTags.forEach((metaTag) =>
          metaTags.push(this.communityMashupService.itemIdMap.get(metaTag))
        );

        const image: Image = this.communityMashupService.itemIdMap.get(
          content.images[0]
        );

        const connections: Connection[] = [];
        content.connectedBy.forEach((connection) =>
          connections.push(
            this.communityMashupService.itemIdMap.get(connection)
          )
        );

        let person: Person | undefined;
        const organisations: Organisation[] = [];
        connections.forEach((connection) => {
          const item = this.communityMashupService.itemIdMap.get(
            connection.toId
          );
          if (item instanceof Person) person = item;
          else organisations.push(item);
        });

        const tags: Tag[] = [];
        content.tags.forEach((tag) =>
          tags.push(this.communityMashupService.itemIdMap.get(tag))
        );
        announcements.push(
          this.createAnnouncementFromMashupItems(
            content,
            identifier,
            metaTags,
            image,
            organisations,
            tags,
            person
          )
        );
      });

      this._announcements$.next(this.shuffleAnnouncements(announcements));
      this.isLoadingDataFromMashup$.next(false);
    });
  }

  get announcements$() {
    return this._announcements$;
  }

  private createAnnouncementFromMashupItems(
    content: Content,
    identifier: Identifier,
    metaTags: MetaTag[],
    image: Image,
    organisations: Organisation[],
    tags: Tag[],
    person?: Person
  ): Announcement {
    const announcement: Announcement = {
      advisor: '',
      advisorMail: '',
      description: '',
      editLinkToWordpressCms: '',
      faculty: '',
      id: 0,
      imageSrc: '',
      institute: '',
      professorship: '',
      keywords: [],
      state: '',
      title: '',
      types: [],
    };

    announcement.id = Number(identifier.value);
    announcement.editLinkToWordpressCms =
      'https://cms.communitymirrors.net/wp-admin/post.php?post=' +
      announcement.id +
      '&action=edit';
    announcement.title = content.name;
    announcement.description = content.stringValue;
    announcement.advisor = person?.name ? person.name : '';
    announcement.imageSrc = image?.fileUrl;

    metaTags.forEach((metaTag) => {
      if (metaTag.name.startsWith('type:'))
        announcement.types.push(this.mapMetaTagToType(metaTag));
      else if (metaTag.name.startsWith('state:'))
        announcement.state = this.mapMetaTagToState(metaTag);
    });

    organisations.forEach((organisation) => {
      if (organisation.name.startsWith('Fakultät'))
        announcement.faculty = organisation.name;
      else if (organisation.name.startsWith('Professur'))
        announcement.professorship = organisation.name;
      else announcement.institute = organisation.name;
    });

    announcement.keywords = tags.map((tag) => tag.name);

    person?.metaInformations.forEach((metaInformation) => {
      const item = this.communityMashupService.itemIdMap.get(metaInformation);
      if (item.type === 'data:email') announcement.advisorMail = item.address;
    });

    return announcement;
  }

  private mapMetaTagToState(metaTag: MetaTag): string {
    switch (metaTag.name.replace('state:', '')) {
      case 'verfügbar':
        return 'Verfügbar';
      case 'in bearbeitung':
        return 'In Bearbeitung';
      case 'abgeschlossen':
        return 'Abgeschlossen';
    }

    return '';
  }

  private mapMetaTagToType(metaTag: MetaTag): string {
    switch (metaTag.name.replace('type:', '')) {
      case 'masterarbeit':
        return 'Masterarbeit';
      case 'bachelorarbeit':
        return 'Bachelorarbeit';
      case 'projektstudium (ba)':
        return 'Projektstudium (BA)';
      case 'praxisprojekt (ma)':
        return 'Praxisprojekt (MA)';
      case 'projektstudium (win)':
        return 'Projektstudium (WIN)';
      case 'kompetenztraining':
        return 'Kompetenztraining';
    }

    return '';
  }

  private shuffleAnnouncements(announcements: Announcement[]) {
    for (let i = announcements.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      const temp = announcements[i];
      announcements[i] = announcements[j];
      announcements[j] = temp;
    }

    return announcements;
  }
}

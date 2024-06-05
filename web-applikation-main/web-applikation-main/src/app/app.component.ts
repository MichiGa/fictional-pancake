import {Component} from '@angular/core';
import {fromEvent} from "rxjs";
import { CommunityMashupService } from './communitymashup/communitymashup.service';
import { MetaTag } from './communitymashup/model/metatag.model';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  viewportWidth: number = window.innerWidth;
  isInIFrame = true;

  constructor(/*private snackBar: MatSnackBar*/) {
    fromEvent(window, 'resize').subscribe(() => this.viewportWidth = window.innerWidth);
    try {
      this.isInIFrame = window.self !== window.top;
    } catch (e) {
    }

    /*this.snackBar.openFromComponent(AdvertisementSnackbarComponent, {
      horizontalPosition: "center",
      verticalPosition: "top",
      politeness: "polite",
      duration: 30000
    });*/
  }

  clickOnInfoIcon() {
    window.open('https://publicwiki.unibw.de/display/MCI/Abschlussarbeiten/', '_blank')?.focus();
  }
}

export class Item {

  // reference to service
  communitymashupservice: CommunityMashupService = null as any;

  // attributes
  ident: string;
  uri: string;
  stringValue: string;
  created: string;
  lastModified: string;
  // relationships - store idents
  connectedBy: string[] = [];
  identifiedBy: string[] = [];
  metaTags: string[] = [];

  // initialize attributes and relations from attribute value pairs in parameter object
  constructor(item: any, public service: CommunityMashupService) {
    this.communitymashupservice = service;
    // attributes
    this.ident = item['ident'];
    this.uri = item['uri'];
    this.stringValue = item['stringValue'];
    this.lastModified = item['lastModified'];
    this.created = item['created'];
    // relationship connectedBy
    var tmps = item['connectedBy'];
    if (tmps) {
      var tmpsArr = tmps.split(" ");
      tmpsArr.forEach((id: any) => this.connectedBy.push(id));
    }
    // old data models may use connectedTo instead of connectedBy
    var tmps = item['connectedTo'];
    if (tmps) {
      var tmpsArr = tmps.split(" ");
      tmpsArr.forEach((id: any) => this.connectedBy.push(id));
    }
    // relationship identifiedBy
    tmps = item['identifiedBy'];
    if (tmps) {
      var tmpsArr = tmps.split(" ");
      tmpsArr.forEach((id: any) => this.identifiedBy.push(id));
    }
    // relationship metaTags
    tmps = item['metaTags'];
    if (tmps) {
      var tmpsArr = tmps.split(" ");
      tmpsArr.forEach((id: any) => this.metaTags.push(id));
    }
  }

  getMetaTags(): MetaTag[] {
    var result: MetaTag[] = [];
    this.metaTags.forEach(id => result.push(this.service.getItemById(id)));
    return result;
  }

  getMetaTagsAsString(): string {
    var result: string = "";
    this.metaTags.forEach(id => {
      result = result + "," + this.service.getItemById(id).name;
    });
    return result;
  }

  // get all items connected from this item
  // (either directly or via connections)
  getConnectedItems(): Item[] {
    var result: Item[] = [];
    this.connectedBy.forEach(id => {
      var connection = this.service.getItemById(id);
      result.push(this.service.getItemById(connection.toId));
    });
    return result;
  }

  getConnectedToItems(): Item[] {
    return this.getConnectedItems();
  }

  // get all items that connect to this item
  getConnectedFromItems(): Item[] {
    var result: Item[] = [];
    var connections = this.service.getConnections(null as any);
    connections.forEach(connection => {
      if (connection.toId === this.ident) {
        result.push(this.service.getItemById(connection.fromId));
      }
    });
    return result;
  }

}

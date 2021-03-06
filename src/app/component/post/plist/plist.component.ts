import { PaginationService } from './../../../service/pagination.service';
import { PostService } from './../../../service/post.service';
import { Component, OnInit } from '@angular/core';
import { IPage, IPost } from 'src/app/model/model-interfaces';
import { ActivatedRoute, Router } from '@angular/router';
import { Subject } from 'rxjs';


@Component({
  selector: 'app-plist',
  templateUrl: './plist.component.html',
  styleUrls: ['./plist.component.css']
})
export class PlistPostComponent implements OnInit {

  aPosts: IPost[];
  totalElements: number;
  totalPages: number;
  page: number;
  campo: string;
  orden: boolean;
  barraPaginacion: string[];
  pageSize: number = 10;
  id: number = null;
  oPost:IPost;

  strUsuarioSession: string;

  constructor(
    private oRoute: ActivatedRoute,
    private oRouter: Router,
    private oPaginationService: PaginationService,
    private oPostService: PostService,    
  ) {

    if (this.oRoute.snapshot.data.message) {
      this.strUsuarioSession = this.oRoute.snapshot.data.message;
      localStorage.setItem("user", this.oRoute.snapshot.data.message);
    } else {
      localStorage.clear();
      oRouter.navigate(['/home']);
    }

    this.page = 1;
    this.campo="id";
    this.orden=true;    
    this.getPage();
  }

  ngOnInit(): void {
  }

  getPage = () => {
    this.oPostService.getPage(this.pageSize, this.page,this.campo,this.orden).subscribe((oPage: IPage) => {
      this.aPosts = oPage.content;
      this.totalElements = oPage.totalElements;
      this.totalPages = oPage.totalPages;
      this.barraPaginacion = this.oPaginationService.pagination(this.totalPages, this.page);
    })
  }
  
  jumpToPage = () => {
    this.getPage();
    return false;
  }
  eventsSubject: Subject<void> = new Subject<void>();

  openModal(id:number):void {
    this.eventsSubject.next();
    this.oPostService.getOne(id).subscribe(data=>{
      this.oPost=data;
    })
  }

  closeModal():void {
    this.oRouter.navigate(["/plist/" ]);
  }
 
  
  }



import { Component, OnInit, ViewChild, Input, Output, OnDestroy } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Subject } from 'rxjs';
import 'rxjs/add/operator/takeUntil';
import { SessionStorageService } from 'ngx-webstorage';
import { DatabaseService } from '../../../services/database/database.service';


@Component({
    selector: 'app-add-article',
    templateUrl: './add-article.component.html',
    styleUrls: ['./add-article.component.css']
})
export class AddArticleComponent implements OnInit, OnDestroy {

    @ViewChild('articleTag') articleTag;
    public tags;
    public addArticleForm: FormGroup;
    public articleTitle: FormControl;
    public articleTags: FormControl;
    public articleContent: FormControl;
    private imageName: object;
    public success: boolean;
    public error: boolean;
    private userId: number;
    private unsubscribe = new Subject<void>();
    public tinymceInit;

    constructor(private session: SessionStorageService, private databaseService: DatabaseService) {
        this.success = false;
		this.error = false;
     }

    ngOnInit() {
        this.userId = this.session.retrieve("login").id;
        this.getAllTags();
        this.createFormControls();
        this.createForm();
        this.tinymceInit = {
                selector: 'textarea',
                theme: 'modern',
                plugins: ['advlist autolink lists link image charmap print preview hr anchor pagebreak',
                'searchreplace wordcount visualblocks visualchars code fullscreen',
                'insertdatetime media nonbreaking save table contextmenu directionality',
                'emoticons template paste textcolor colorpicker textpattern imagetools'
                ],
                toolbar1: 'insertfile undo redo | styleselect | bold italic | alignleft aligncenter alignright alignjustify | bullist numlist outdent indent | link image',
                image_advtab: true,
                templates: [
                    { title: 'Test template 1', content: 'Test 1' },
                    { title: 'Test template 2', content: 'Test 2' }
                ]
           }
    }

    getAllTags() {
		this.databaseService.getAllTags().takeUntil(this.unsubscribe).subscribe(response =>{
            this.tags = response;
        })
    }
    createFormControls() {
		this.articleTitle = new FormControl('', [
			Validators.required,
			Validators.maxLength(100)
		]);
		this.articleTags = new FormControl('', [
			Validators.required,
		]);
		this.articleContent = new FormControl('', [
			Validators.required,
			Validators.minLength(1),
			Validators.maxLength(5000)
        ]);        
	}

	createForm() {
		this.addArticleForm = new FormGroup({
			articleTitle: this.articleTitle,
			articleTags: this.articleTags,
            articleContent: this.articleContent
		});
    }

    addArticle(target) {
		this.success = false;
		this.error = false;
		var tags = [];
		for (var i = 0; i < this.articleTag.nativeElement.length; i++) {
			if (this.articleTag.nativeElement[i].selected) {
				tags.push(this.articleTag.nativeElement[i].attributes[2].nodeValue);
			}
		}
		var article = {
			'title': this.addArticleForm.value.articleTitle,
			'content': this.articleContent.value,
			'image': this.imageName,
			'tags': tags,
            'user': this.userId,
        }
        this.articleTags.setValue(tags);
		if (this.addArticleForm.valid) {
			var formData = new FormData();
			for (var key in article) {
				formData.append(key, article[key]);
			}
			this.databaseService.addArticle(formData).takeUntil(this.unsubscribe).subscribe(response => {
				console.log(response)
				if (response == 'Inserted') {
                    this.success = true;
                    target.scrollIntoView({ behavior: "smooth" });
				}
				else {
					this.error = true;
				}
			});
		}
	}
    
    getImages(event) {
		this.imageName = event.target.files[0];
	}

    ngOnDestroy(): void {
        this.unsubscribe.next();
        this.unsubscribe.complete();
        //tinymce.remove(this.editor);
    }
}

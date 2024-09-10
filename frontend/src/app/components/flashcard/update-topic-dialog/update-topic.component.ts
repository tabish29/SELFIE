import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-update-topic',
  templateUrl: './update-topic.component.html',
  styleUrl: './update-topic.component.css'
})
export class UpdateTopicDialogComponent {
  updatedTopicName: string = ''; 

  constructor(
    public dialogRef: MatDialogRef<UpdateTopicDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any 
  ) {

    if (data && data.topicName) {
      this.updatedTopicName = data.topicName;
    }
  }

  onSave(): void {
    if (this.updatedTopicName.trim()) {
      const updatedTopicData = {
        oldTopicName: this.data.topicName, 
        newTopicName: this.updatedTopicName
      };
      this.dialogRef.close(updatedTopicData); 
    } else {
      console.error('Il nome del topic non può essere vuoto.');
    }
  }

  onCancel(): void {
    this.dialogRef.close(); 
  }

}

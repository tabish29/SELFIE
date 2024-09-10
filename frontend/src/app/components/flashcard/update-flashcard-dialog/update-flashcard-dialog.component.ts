import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-update-flashcard-dialog',
  templateUrl: './update-flashcard-dialog.component.html',
  styleUrl: './update-flashcard-dialog.component.css'
})
export class UpdateFlashcardDialogComponent {
  updatedQuestion: string = '';
  updatedAnswer: string = '';

  constructor(
    public dialogRef: MatDialogRef<UpdateFlashcardDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any 
  ) {
    if (data && data.flashcard) {
      this.updatedQuestion = data.flashcard.question;
      this.updatedAnswer = data.flashcard.answer;
    }
  }

  onSave(): void {
    if (this.updatedQuestion.trim() && this.updatedAnswer.trim()) {
      const updatedFlashcardData = {
        oldQuestion: this.data.flashcard.question,
        newQuestion: this.updatedQuestion,
        newAnswer: this.updatedAnswer
      };
      this.dialogRef.close(updatedFlashcardData);
    } else {
      console.error('La domanda e la risposta non possono essere vuote.');
    }
  }

  onCancel(): void {
    this.dialogRef.close();
  }

}

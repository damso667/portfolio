// ============================================================
// contact-section.component.ts — Section "Entrons en contact"
//
// Rôle :
//  - Afficher un formulaire de contact (Nom, Email, Sujet, Message)
//  - Envoyer le message directement par email via EmailJS
//    (aucun backend nécessaire)
//  - Afficher l'état d'envoi (chargement, succès, erreur)
//  - Afficher les liens vers les réseaux sociaux et l'email direct
//
// ⚠️ CONFIGURATION REQUISE :
//  Remplace les 3 constantes EMAILJS_* ci-dessous par tes propres
//  identifiants obtenus sur https://www.emailjs.com
//  → Voir le guide d'installation fourni avec ce composant.
// ============================================================

import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, NgForm } from '@angular/forms';

// Déclaration du SDK EmailJS chargé via CDN dans index.html
declare const emailjs: any;

// ── Interface décrivant les données du formulaire ──
interface ContactForm {
  name: string;
  email: string;
  subject: string;
  message: string;
}

// ── États possibles de l'envoi du formulaire ──
type SendStatus = 'idle' | 'sending' | 'success' | 'error';

@Component({
  selector: 'app-contact-section',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './contact-section.html',
  styleUrls: ['./contact-section.css'],
})
export class ContactSectionComponent {

  // ============================================================
  // CONFIGURATION EMAILJS
  // ============================================================
  // 1. Crée un compte gratuit sur https://www.emailjs.com
  // 2. Ajoute un service email (ex: Gmail) → copie le SERVICE_ID
  // 3. Crée un template d'email → copie le TEMPLATE_ID
  // 4. Dans "Account" → "General" → copie ta PUBLIC_KEY
  //
  // Le guide complet est fourni dans le fichier EMAILJS_SETUP.md
  // ============================================================
  private readonly EMAILJS_SERVICE_ID  = 'service_senhbyg';
  private readonly EMAILJS_TEMPLATE_ID = 'template_iragdms';
  private readonly EMAILJS_PUBLIC_KEY  = 'REi58AEadkPdDseHv';

  // ── Modèle du formulaire (lié via ngModel) ──
  formData: ContactForm = {
    name: '',
    email: '',
    subject: '',
    message: '',
  };

  // ── État actuel de l'envoi ──
  sendStatus: SendStatus = 'idle';

  // ── Message d'erreur éventuel à afficher ──
  errorMessage = '';

  // ── Informations de contact direct ──
  contactInfo = [
    {
      icon:  'fa-solid fa-envelope',
      label: 'Email',
      value: 'njassineadrien@gmail.com',
      link:  'mailto:njassineadrien@gmail.com',
    },
    {
      icon:  'fa-solid fa-location-dot',
      label: 'Localisation',
      value: 'Yaoundé, Cameroun',
      link:  '',
    },
  ];

  // ── Liens vers les réseaux sociaux ──
  socialLinks = [
    {
      label:     'GitHub',
      icon:      'fa-brands fa-github',
      url:       'https://github.com/damso667',
      ariaLabel: 'Voir mon profil GitHub',
    },
    {
      label:     'LinkedIn',
      icon:      'fa-brands fa-linkedin-in',
      url:       'https://linkedin.com/in/adrien-njassine-0b75a839a',
      ariaLabel: 'Voir mon profil LinkedIn',
    },
  ];

  // ============================================================
  // ENVOI DU FORMULAIRE
  // ============================================================

  /**
   * Soumet le formulaire via EmailJS.
   * @param form - Référence au NgForm pour validation et reset
   */
  onSubmit(form: NgForm): void {
    // Vérifie que le formulaire est valide avant d'envoyer
    if (form.invalid) {
      Object.values(form.controls).forEach((control) => control.markAsTouched());
      return;
    }

    this.sendStatus = 'sending';
    this.errorMessage = '';

    // Vérifie que le SDK EmailJS est bien chargé (script CDN dans index.html)
    if (typeof emailjs === 'undefined') {
      this.sendStatus = 'error';
      this.errorMessage = 'Le service d\'envoi n\'est pas chargé. Vérifie le script EmailJS dans index.html.';
      return;
    }

    // ── Paramètres envoyés au template EmailJS ──
    // Ces noms (from_name, from_email, etc.) doivent correspondre
    // aux variables {{from_name}} etc. utilisées dans ton template EmailJS.
    const templateParams = {
      from_name:  this.formData.name,
      from_email: this.formData.email,
      subject:    this.formData.subject,
      message:    this.formData.message,
    };

    // ── Appel à l'API EmailJS ──
    emailjs
      .send(this.EMAILJS_SERVICE_ID, this.EMAILJS_TEMPLATE_ID, templateParams, this.EMAILJS_PUBLIC_KEY)
      .then(() => {
        this.sendStatus = 'success';
        this.resetForm(form);

        setTimeout(() => {
          if (this.sendStatus === 'success') this.sendStatus = 'idle';
        }, 5000);
      })
      .catch((error: any) => {
        console.error('Erreur EmailJS :', error);
        this.sendStatus = 'error';
        this.errorMessage = 'Une erreur est survenue. Réessaie ou écris-moi directement par email.';
      });
  }

  /**
   * Réinitialise le formulaire après un envoi réussi.
   */
  private resetForm(form: NgForm): void {
    this.formData = { name: '', email: '', subject: '', message: '' };
    form.resetForm();
  }
}
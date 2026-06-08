import React from 'react';
import { FaShieldAlt, FaLock, FaUserSecret, FaCookie, FaEnvelope } from 'react-icons/fa';
import Header from '../../visiteur/components/Header';
import Footer from '../../visiteur/components/Footer';

const Section = ({ titre, children }) => (
  <div className="mb-10">
    <h2 className="text-xl font-playfair font-bold text-amber-800 mb-4 flex items-center gap-2">
      <span className="w-1 h-6 bg-amber-500 rounded-full inline-block" />
      {titre}
    </h2>
    <div className="text-gray-600 text-sm leading-relaxed space-y-3">
      {children}
    </div>
  </div>
);

const ConfidentialitePage = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 via-white to-amber-100">
      <Header />

      <main className="pt-32 pb-20">
        <div className="container mx-auto px-4">

          {/* En-tête */}
          <div className="text-center mb-14">
            <div className="inline-flex items-center gap-2 bg-amber-100 text-amber-700 text-xs font-semibold tracking-widest uppercase px-4 py-2 rounded-full mb-6">
              <FaShieldAlt /> Vie privée
            </div>
            <h1 className="text-4xl md:text-5xl font-playfair font-bold text-amber-800 mb-4">
              Politique de confidentialité
            </h1>
            <div className="flex items-center justify-center gap-2 mb-4">
              <div className="w-16 h-px bg-amber-300" />
              <div className="w-2 h-2 bg-amber-400 rounded-full" />
              <div className="w-16 h-px bg-amber-300" />
            </div>
            <p className="text-amber-500 text-sm">Dernière mise à jour : juin 2026</p>
          </div>

          <div className="max-w-3xl mx-auto bg-white rounded-2xl shadow-lg p-8 md:p-12">

            {/* Intro */}
            <div className="bg-amber-50 border border-amber-200 rounded-xl p-5 mb-10 text-sm text-amber-700 leading-relaxed">
              SAGESSE AFRICAINE s'engage à protéger la vie privée de ses utilisateurs.
              Cette politique décrit comment nous collectons, utilisons et protégeons vos données personnelles
              conformément aux lois en vigueur.
            </div>

            <Section titre="1. Responsable du traitement">
              <p>
                Le responsable du traitement des données personnelles est <strong>SAGESSE AFRICAINE</strong>,
                groupe panafricain de presses, d'édition et de diffusion culturelle, dont le siège social
                est situé à Yaoundé, Cameroun.
              </p>
              <p>Contact : <a href="mailto:Marieconstantin51@yahoo.com" className="text-amber-600 hover:underline">Marieconstantin51@yahoo.com</a></p>
            </Section>

            <Section titre="2. Données collectées">
              <p>Nous collectons les données suivantes lors de votre utilisation de notre plateforme :</p>
              <ul className="list-none space-y-2 mt-2">
                {[
                  'Données d\'identification : nom, prénom, adresse email, numéro de téléphone',
                  'Données de connexion : adresse IP, navigateur, date et heure de connexion',
                  'Données de transaction : historique des achats, mode de paiement (non les numéros de carte)',
                  'Données de navigation : pages visitées, livres consultés',
                  'Données que vous nous fournissez : messages de contact, soumissions de manuscrits',
                ].map((item, i) => (
                  <li key={i} className="flex items-start gap-2">
                    <FaLock className="text-amber-400 mt-0.5 flex-shrink-0 text-xs" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </Section>

            <Section titre="3. Finalités du traitement">
              <p>Vos données sont collectées pour les finalités suivantes :</p>
              <ul className="list-disc pl-5 space-y-1 mt-2">
                <li>Gestion de votre compte utilisateur et authentification</li>
                <li>Traitement de vos commandes et paiements</li>
                <li>Envoi d'informations sur nos publications et services (avec votre consentement)</li>
                <li>Amélioration de nos services et de l'expérience utilisateur</li>
                <li>Respect de nos obligations légales et comptables</li>
                <li>Traitement des soumissions de manuscrits</li>
              </ul>
            </Section>

            <Section titre="4. Base légale du traitement">
              <p>Le traitement de vos données repose sur :</p>
              <ul className="list-disc pl-5 space-y-1 mt-2">
                <li><strong>L'exécution du contrat</strong> : traitement des commandes, gestion de compte</li>
                <li><strong>Votre consentement</strong> : newsletters et communications marketing</li>
                <li><strong>L'intérêt légitime</strong> : amélioration des services, sécurité</li>
                <li><strong>L'obligation légale</strong> : facturation, archivage comptable</li>
              </ul>
            </Section>

            <Section titre="5. Conservation des données">
              <p>
                Vos données personnelles sont conservées pendant la durée strictement nécessaire
                aux finalités pour lesquelles elles ont été collectées :
              </p>
              <ul className="list-disc pl-5 space-y-1 mt-2">
                <li>Données de compte : durée d'activité du compte + 3 ans</li>
                <li>Données de transaction : 10 ans (obligation comptable)</li>
                <li>Données de contact : 3 ans après le dernier contact</li>
                <li>Cookies de navigation : 13 mois maximum</li>
              </ul>
            </Section>

            <Section titre="6. Partage des données">
              <p>
                Nous ne vendons jamais vos données. Nous pouvons partager vos données uniquement avec :
              </p>
              <ul className="list-disc pl-5 space-y-1 mt-2">
                <li>Nos prestataires de paiement sécurisé (traitement des transactions)</li>
                <li>Nos prestataires d'hébergement et d'infrastructure technique</li>
                <li>Les autorités compétentes sur réquisition légale</li>
              </ul>
            </Section>

            <Section titre="7. Cookies">
              <div className="flex items-start gap-3">
                <FaCookie className="text-amber-400 text-2xl flex-shrink-0 mt-1" />
                <div>
                  <p>
                    Notre site utilise des cookies pour améliorer votre expérience de navigation,
                    mémoriser vos préférences et analyser le trafic. Les cookies strictement nécessaires
                    au fonctionnement du site ne peuvent pas être désactivés.
                    Les cookies analytiques et marketing nécessitent votre consentement.
                  </p>
                </div>
              </div>
            </Section>

            <Section titre="8. Vos droits">
              <p>
                Conformément à la législation applicable, vous disposez des droits suivants :
              </p>
              <ul className="list-none space-y-2 mt-2">
                {[
                  'Droit d\'accès à vos données personnelles',
                  'Droit de rectification des données inexactes',
                  'Droit à l\'effacement (droit à l\'oubli)',
                  'Droit à la portabilité de vos données',
                  'Droit d\'opposition au traitement',
                  'Droit de retirer votre consentement à tout moment',
                ].map((droit, i) => (
                  <li key={i} className="flex items-start gap-2">
                    <FaUserSecret className="text-amber-400 mt-0.5 flex-shrink-0 text-xs" />
                    <span>{droit}</span>
                  </li>
                ))}
              </ul>
              <p className="mt-4">
                Pour exercer vos droits, contactez-nous à :{' '}
                <a href="mailto:Marieconstantin51@yahoo.com" className="text-amber-600 hover:underline">
                  Marieconstantin51@yahoo.com
                </a>
              </p>
            </Section>

            <Section titre="9. Sécurité">
              <p>
                Nous mettons en œuvre des mesures techniques et organisationnelles appropriées
                pour protéger vos données contre tout accès non autorisé, altération, divulgation
                ou destruction. Nos communications sont chiffrées via le protocole HTTPS.
              </p>
            </Section>

            <Section titre="10. Modifications">
              <p>
                Nous nous réservons le droit de modifier cette politique de confidentialité à tout moment.
                Toute modification substantielle vous sera notifiée par email ou via un avis prominent
                sur notre site. La date de dernière mise à jour est indiquée en haut de ce document.
              </p>
            </Section>

            {/* Contact */}
            <div className="mt-10 bg-amber-50 border border-amber-200 rounded-xl p-5 flex items-start gap-4">
              <FaEnvelope className="text-amber-500 text-xl flex-shrink-0 mt-0.5" />
              <div>
                <p className="font-semibold text-amber-800 text-sm">Des questions sur cette politique ?</p>
                <p className="text-gray-500 text-sm mt-1">
                  Contactez notre responsable protection des données à :{' '}
                  <a href="mailto:Marieconstantin51@yahoo.com" className="text-amber-600 hover:underline">
                    Marieconstantin51@yahoo.com
                  </a>
                </p>
              </div>
            </div>

          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default ConfidentialitePage;

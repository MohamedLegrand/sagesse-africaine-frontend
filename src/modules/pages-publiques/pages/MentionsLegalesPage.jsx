import React from 'react';
import { FaGavel, FaEnvelope } from 'react-icons/fa';
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

const MentionsLegalesPage = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 via-white to-amber-100">
      <Header />

      <main className="pt-32 pb-20">
        <div className="container mx-auto px-4">

          {/* En-tête */}
          <div className="text-center mb-14">
            <div className="inline-flex items-center gap-2 bg-amber-100 text-amber-700 text-xs font-semibold tracking-widest uppercase px-4 py-2 rounded-full mb-6">
              <FaGavel /> Informations légales
            </div>
            <h1 className="text-4xl md:text-5xl font-playfair font-bold text-amber-800 mb-4">
              Mentions légales
            </h1>
            <div className="flex items-center justify-center gap-2 mb-4">
              <div className="w-16 h-px bg-amber-300" />
              <div className="w-2 h-2 bg-amber-400 rounded-full" />
              <div className="w-16 h-px bg-amber-300" />
            </div>
            <p className="text-amber-500 text-sm">Dernière mise à jour : juin 2026</p>
          </div>

          <div className="max-w-3xl mx-auto bg-white rounded-2xl shadow-lg p-8 md:p-12">

            <Section titre="1. Éditeur du site">
              <div className="bg-amber-50 rounded-xl p-5 space-y-2">
                <div><span className="font-semibold text-amber-700">Nom :</span> SAGESSE AFRICAINE</div>
                <div><span className="font-semibold text-amber-700">Nature :</span> Groupe panafricain de presses, d'édition et de diffusion culturelle</div>
                <div><span className="font-semibold text-amber-700">Siège social :</span> Yaoundé, Cameroun</div>
                <div>
                  <span className="font-semibold text-amber-700">Email :</span>{' '}
                  <a href="mailto:Marieconstantin51@yahoo.com" className="text-amber-600 hover:underline">
                    Marieconstantin51@yahoo.com
                  </a>
                </div>
                <div><span className="font-semibold text-amber-700">Téléphone :</span> (+237) 677 31 44 12 / (+237) 693 21 54 31</div>
              </div>
            </Section>

            <Section titre="2. Directeur de la publication">
              <p>
                Le directeur de la publication de ce site est le représentant légal de
                la structure SAGESSE AFRICAINE.
              </p>
            </Section>

            <Section titre="3. Hébergement">
              <p>
                Ce site est hébergé par un prestataire d'hébergement professionnel.
                Pour toute demande relative à l'hébergement, vous pouvez nous contacter
                à l'adresse email indiquée ci-dessus.
              </p>
            </Section>

            <Section titre="4. Propriété intellectuelle">
              <p>
                L'ensemble du contenu de ce site (textes, images, graphismes, logo, icônes, sons, logiciels, etc.)
                est la propriété exclusive de SAGESSE AFRICAINE ou de ses partenaires éditoriaux,
                sauf mention contraire.
              </p>
              <p>
                Toute reproduction, représentation, modification, publication, adaptation totale ou partielle
                des éléments du site, quel que soit le moyen ou le procédé utilisé, est interdite sans
                l'autorisation écrite préalable de SAGESSE AFRICAINE.
              </p>
              <p>
                Les droits d'auteur des œuvres publiées sur notre plateforme appartiennent à leurs auteurs respectifs.
                Toute reproduction non autorisée constitue une contrefaçon sanctionnée par la loi.
              </p>
            </Section>

            <Section titre="5. Droits d'auteur des livres">
              <p>
                Les ouvrages disponibles sur la plateforme SAGESSE AFRICAINE sont protégés par le droit d'auteur.
                Les livres achetés sont destinés à un usage personnel et strictement non-commercial.
                Tout partage, revente ou reproduction des contenus est strictement interdit.
              </p>
            </Section>

            <Section titre="6. Limitation de responsabilité">
              <p>
                SAGESSE AFRICAINE s'efforce de fournir des informations aussi précises que possible.
                Cependant, nous ne pouvons garantir l'exactitude, la complétude et l'actualité des
                informations diffusées sur ce site.
              </p>
              <p>
                SAGESSE AFRICAINE décline toute responsabilité pour tout dommage résultant de
                l'utilisation du site ou d'informations provenant de sites tiers auxquels notre
                site renvoie par des liens hypertextes.
              </p>
            </Section>

            <Section titre="7. Liens hypertextes">
              <p>
                Le site peut contenir des liens vers d'autres sites internet. SAGESSE AFRICAINE
                n'exerce aucun contrôle sur ces sites tiers et décline toute responsabilité quant
                à leur contenu.
              </p>
              <p>
                La création de liens hypertextes vers le site de SAGESSE AFRICAINE est possible
                sous réserve d'une autorisation préalable et expresse de notre part.
              </p>
            </Section>

            <Section titre="8. Droit applicable">
              <p>
                Le présent site et ses mentions légales sont soumis au droit camerounais.
                En cas de litige, les tribunaux camerounais seront seuls compétents.
              </p>
            </Section>

            {/* Contact */}
            <div className="mt-10 bg-amber-50 border border-amber-200 rounded-xl p-5 flex items-start gap-4">
              <FaEnvelope className="text-amber-500 text-xl flex-shrink-0 mt-0.5" />
              <div>
                <p className="font-semibold text-amber-800 text-sm">Nous contacter</p>
                <p className="text-gray-500 text-sm mt-1">
                  Pour toute question relative aux mentions légales :{' '}
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

export default MentionsLegalesPage;

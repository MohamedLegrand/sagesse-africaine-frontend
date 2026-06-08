import React from 'react';
import { FaFileContract, FaEnvelope, FaShieldAlt } from 'react-icons/fa';
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

const CGVPage = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 via-white to-amber-100">
      <Header />

      <main className="pt-32 pb-20">
        <div className="container mx-auto px-4">

          {/* En-tête */}
          <div className="text-center mb-14">
            <div className="inline-flex items-center gap-2 bg-amber-100 text-amber-700 text-xs font-semibold tracking-widest uppercase px-4 py-2 rounded-full mb-6">
              <FaFileContract /> Conditions commerciales
            </div>
            <h1 className="text-4xl md:text-5xl font-playfair font-bold text-amber-800 mb-4">
              Conditions Générales de Vente
            </h1>
            <div className="flex items-center justify-center gap-2 mb-4">
              <div className="w-16 h-px bg-amber-300" />
              <div className="w-2 h-2 bg-amber-400 rounded-full" />
              <div className="w-16 h-px bg-amber-300" />
            </div>
            <p className="text-amber-500 text-sm">Dernière mise à jour : juin 2026</p>
          </div>

          <div className="max-w-3xl mx-auto bg-white rounded-2xl shadow-lg p-8 md:p-12">

            <div className="bg-amber-50 border border-amber-200 rounded-xl p-5 mb-10 text-sm text-amber-700 leading-relaxed">
              Les présentes Conditions Générales de Vente (CGV) régissent l'ensemble des ventes
              de produits numériques (livres électroniques) et physiques effectuées via la plateforme
              SAGESSE AFRICAINE. Toute commande implique l'acceptation sans réserve de ces CGV.
            </div>

            <Section titre="1. Identité du vendeur">
              <div className="bg-amber-50 rounded-xl p-5 space-y-2">
                <div><span className="font-semibold text-amber-700">Vendeur :</span> SAGESSE AFRICAINE</div>
                <div><span className="font-semibold text-amber-700">Siège :</span> Yaoundé, Cameroun</div>
                <div>
                  <span className="font-semibold text-amber-700">Email :</span>{' '}
                  <a href="mailto:Marieconstantin51@yahoo.com" className="text-amber-600 hover:underline">
                    Marieconstantin51@yahoo.com
                  </a>
                </div>
                <div><span className="font-semibold text-amber-700">Téléphone :</span> (+237) 677 31 44 12</div>
              </div>
            </Section>

            <Section titre="2. Produits et services">
              <p>SAGESSE AFRICAINE propose à la vente :</p>
              <ul className="list-disc pl-5 space-y-1 mt-2">
                <li>Des livres numériques (eBooks) téléchargeables</li>
                <li>Des livres physiques (sous réserve de disponibilité)</li>
                <li>Des abonnements à des collections thématiques</li>
              </ul>
              <p>
                Les caractéristiques essentielles des produits sont présentées sur chaque fiche livre.
                Les photographies et visuels sont donnés à titre illustratif et non contractuel.
              </p>
            </Section>

            <Section titre="3. Prix">
              <p>
                Les prix sont indiqués en Francs CFA (FCFA) toutes taxes comprises.
                SAGESSE AFRICAINE se réserve le droit de modifier ses prix à tout moment.
                Les produits sont facturés au prix en vigueur au moment de la validation de la commande.
              </p>
              <p>
                Certains ouvrages peuvent être proposés gratuitement dans le cadre d'actions
                promotionnelles. La gratuité d'un ouvrage ne préjuge pas de sa disponibilité
                future à titre gratuit.
              </p>
            </Section>

            <Section titre="4. Commande et paiement">
              <p>
                Pour passer une commande, vous devez disposer d'un compte utilisateur valide.
                La commande est considérée comme ferme et définitive après validation du paiement.
              </p>
              <p><strong>Moyens de paiement acceptés :</strong></p>
              <ul className="list-disc pl-5 space-y-1 mt-2">
                <li>Mobile Money (MTN Mobile Money, Orange Money)</li>
                <li>Carte bancaire (Visa, Mastercard)</li>
                <li>Virement bancaire (sur demande)</li>
              </ul>
              <p>
                Les paiements sont sécurisés et traités par des prestataires certifiés.
                SAGESSE AFRICAINE ne conserve aucune donnée bancaire de ses clients.
              </p>
            </Section>

            <Section titre="5. Livraison et accès aux contenus numériques">
              <p>
                Pour les <strong>livres numériques</strong>, l'accès est immédiat après confirmation du paiement.
                Le livre est disponible dans votre bibliothèque personnelle accessible depuis votre compte.
              </p>
              <p>
                Pour les <strong>livres physiques</strong>, les délais de livraison varient selon votre localisation :
              </p>
              <ul className="list-disc pl-5 space-y-1 mt-2">
                <li>Cameroun : 3 à 7 jours ouvrables</li>
                <li>Afrique centrale : 7 à 15 jours ouvrables</li>
                <li>Reste de l'Afrique et diaspora : 15 à 30 jours ouvrables</li>
              </ul>
            </Section>

            <Section titre="6. Droit de rétractation">
              <p>
                Conformément à la législation en vigueur, le droit de rétractation <strong>ne s'applique pas</strong> aux
                contenus numériques téléchargés ou dont l'exécution a commencé avec votre accord préalable.
              </p>
              <p>
                Pour les livres physiques non encore expédiés, vous disposez d'un délai de 14 jours
                à compter de la validation de votre commande pour exercer votre droit de rétractation,
                sans avoir à justifier de motifs, en nous contactant à l'adresse email indiquée.
              </p>
            </Section>

            <Section titre="7. Propriété intellectuelle et usage des contenus">
              <p>
                L'achat d'un livre vous confère un droit d'usage personnel et non-exclusif.
                Il est strictement interdit de :
              </p>
              <ul className="list-disc pl-5 space-y-1 mt-2">
                <li>Reproduire, copier ou distribuer le contenu acheté</li>
                <li>Revendre ou prêter commercialement un contenu numérique</li>
                <li>Partager votre accès avec des tiers</li>
                <li>Contourner les mesures de protection technique</li>
              </ul>
            </Section>

            <Section titre="8. Responsabilité">
              <p>
                SAGESSE AFRICAINE s'engage à mettre tous les moyens en œuvre pour assurer
                la disponibilité de la plateforme. Cependant, nous ne pouvons garantir
                un service ininterrompu et déclinons toute responsabilité pour les
                dommages résultant d'interruptions de service imprévues.
              </p>
            </Section>

            <Section titre="9. Service après-vente et réclamations">
              <p>
                Pour tout problème lié à votre commande ou à l'accès à vos contenus,
                contactez notre service client :
              </p>
              <ul className="list-none space-y-2 mt-2">
                <li>
                  <span className="font-semibold">Email :</span>{' '}
                  <a href="mailto:Marieconstantin51@yahoo.com" className="text-amber-600 hover:underline">
                    Marieconstantin51@yahoo.com
                  </a>
                </li>
                <li><span className="font-semibold">Téléphone :</span> (+237) 677 31 44 12</li>
                <li><span className="font-semibold">Délai de réponse :</span> sous 48 heures ouvrables</li>
              </ul>
            </Section>

            <Section titre="10. Droit applicable et litiges">
              <p>
                Les présentes CGV sont soumises au droit camerounais. En cas de litige,
                les parties rechercheront en priorité une solution amiable. À défaut,
                les tribunaux compétents de Yaoundé seront saisis.
              </p>
            </Section>

            {/* Badge sécurité */}
            <div className="mt-10 bg-amber-50 border border-amber-200 rounded-xl p-5 flex items-start gap-4">
              <FaShieldAlt className="text-amber-500 text-2xl flex-shrink-0 mt-0.5" />
              <div>
                <p className="font-semibold text-amber-800 text-sm">Achats 100% sécurisés</p>
                <p className="text-gray-500 text-sm mt-1">
                  Vos transactions sont protégées par des protocoles de chiffrement avancés.
                  Pour toute question : {' '}
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

export default CGVPage;

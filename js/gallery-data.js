// Dati galleria per le schede progetto con più immagini (BrandMR, Telefono Terminale).
// Alt text scritti a partire dal contenuto reale di ogni immagine, non dal nome file
// (alcuni file BrandMR hanno nomi che non corrispondono al contenuto: vedi note nel README di progetto).
const GALLERY_PROJECTS = {
    brandmr: {
        basePath: "Immagini/brandmr/",
        widths: [480, 960, 1440, 1920],
        nativeWidth: 4000,
        nativeHeight: 2250,
        images: [
            { file: "01-cover", alt: "Slide di copertina del progetto: titolo “BrandMR — A journey toward systemic innovation”, logo TU Delft e data 18 giugno 2025 su sfondo lavanda." },
            { file: "02-brief-mission", alt: "Slide “The brief & the mission”: testo sulla missione di scardinare un sistema di aiuto legale frammentato, semplificando il percorso per i clienti e sostenendo avvocati e studi legali." },
            { file: "03-metodo-4-fasi-sistemiche", alt: "Slide “Content” con indice in 4 punti numerati: Opening Up & Acknowledging the Interrelatedness of Problems, Developing Empathy with the System, Structuring & Embracing Change, Scaling it on a Systemic Level." },
            { file: "04-stakeholder-matrix", alt: "Mappa degli stakeholder su una matrice interesse/potere: BrandMR al centro, con Juridisch Loket, RVR, il governo, piccoli studi legali e avvocati individuali posizionati attorno." },
            { file: "05-vision", alt: "Slide “Our vision” con cerchi concentrici viola che si restringono verso il centro e testo sulla transizione verso un’esperienza fluida e integrata, il “one stop shop” di BrandMR." },
            { file: "06-issue-tree", alt: "Diagramma ad albero “Issue tree”: la frammentazione dell’ecosistema si scompone in operazioni a silos, impatto sui clienti e impatto sugli avvocati, con le relative cause elencate." },
            { file: "07-customer-journey-ora", alt: "Diagramma “Customer journey - (now)”: linea temporale con azioni e punti di contatto che mostra il percorso attuale, poco coordinato, del cliente nel sistema di aiuto legale." },
            { file: "08-customer-journey-one-stop-shop", alt: "Slide divisoria numerata “3” che introduce la fase “Structuring & Embracing Change” del metodo sistemico in quattro fasi." },
            { file: "09-roadmap-completa", alt: "Diagramma “Backbone of BrandMR” con i moduli del sistema AI: Topic Model & Intake Guidance, Dynamic Point Allocation System, Outcome Analysis & Verification, Learning & Feedback Loop, Case Summarisation & Lawyer Alignment." },
            { file: "10-ai-backbone", alt: "Mockup del report generato dall’AI nella sezione “Offer a case report”: analisi del caso legale, timeline delle fasi previste e prossimi passi consigliati." },
            { file: "11-ui-income-check", alt: "Mockup della dashboard avvocato in “Add a lawyer side of the platform”: panoramica con clienti attivi, messaggi non letti, richieste in sospeso e attività recente." },
            { file: "12-ui-lawyer-dashboard", alt: "Diagramma “Roadmap” con tre fasi su una linea temporale (Today, In 9 mesi, In 18-24 mesi): Structuring for change, Embracing change, Scaling change, con i relativi task elencati." },
            { file: "13-brand-architecture-3-opzioni", alt: "Foto di una pubblicità cittadina su totem stradale: “Legal help shouldn’t be a luxury”, con QR code per verificare l’idoneità al servizio BrandMR." },
            { file: "14-seo-strategy-table", alt: "Mockup del sito BrandMR nella sezione “Enter the market”: homepage verde con form per descrivere il proprio caso legale e video guida." },
            { file: "15-il-sistema-e", alt: "Slide di transizione sfocata con il testo “Due to Lack of compensation”, usata come stacco visivo tra due sezioni della presentazione." },
            { file: "16-dati-ore-pagate-vs-reali", alt: "Slide con citazione testuale: “Social advocacy does not consist of average cases and therefore can’t be generalised” — Interview with a Social Lawyer." },
            { file: "17-quote-avvocato", alt: "Grafico radar “A dynamic point allocation system” con dodici fattori (A-L) e un’unica curva viola, a illustrare il metodo di allocazione punti." },
            { file: "18-dynamic-point-allocation", alt: "Secondo grafico radar dello stesso sistema di allocazione punti, con più curve sovrapposte a confronto tra diversi casi." },
            { file: "19-who-will-benefit", alt: "Grafico “Future situation”: curva a campana che mette in relazione numero di casi e tempo speso, con dettaglio radar sul caso “Termination of employment contract (A020)”." },
            { file: "20-roadmap-sistemica-finale", alt: "Slide di chiusura “Recap” con una composizione di cerchi viola di diverse dimensioni e l’etichetta BrandMR nel cerchio più grande a sinistra." }
        ]
    },
    "telefono-terminale": {
        basePath: "Immagini/telefono-terminale/",
        widths: [480, 960, 1241],
        nativeWidth: 1241,
        nativeHeight: 1754,
        images: [
            { file: "01-cover-identita", alt: "Pagina divisoria in bianco e nero con bande diagonali e riquadro con la scritta “Telefono Terminale”, stile di copertina ricorrente nella tesi." },
            { file: "02-concept-sketches", alt: "Collage di schizzi a matita esplorativi: forme del dispositivo, moduli intercambiabili, riferimenti a Fairphone e Rabbit, note manoscritte su priorità e sistema operativo." },
            { file: "03-moodboard", alt: "Moodboard fotografico con radio CB, mezzi da cantiere, un’auto da corsa con adesivi sponsor, un esoscheletro e un componente elettronico, a riferimento di un linguaggio grezzo e resistente." },
            { file: "04-render-hero-fronte-retro", alt: "Pagina di copertina del progetto con due render 3D del telefono, vista frontale con schermo e vista posteriore con fotocamera e bande diagonali bianco/nero, titolo “Telefono Terminale”." },
            { file: "05-exploded-render", alt: "Render 3D esploso della scocca esterna del dispositivo, con i pannelli e la struttura separati lungo l’asse di montaggio." },
            { file: "06-exploded-componenti-labels", alt: "Render 3D esploso con etichette dei componenti interni: PCB, batteria, modulo fotocamera, modulo jack 3.5mm, speaker, schermo OLED, vetro Gorilla Glass e scocca." },
            { file: "07-disegno-tecnico-quotato", alt: "Disegno tecnico quotato del dispositivo con dimensioni in centimetri (4.0 x 9.0 cm, spessore 0.7 cm), vista assonometrica e render frontale/posteriore a colori." },
            { file: "08-ui-storyboard-assistente-lam", alt: "Quattro schermate dell’interfaccia: schermata di blocco con data e ora, assistente vocale LAM in ascolto, conferma di un messaggio inviato a Sara, e menu principale con Telefono, Sveglia, Direzioni, Musica, Impostazioni." },
            { file: "09-modello-fisico-in-mano", alt: "Due fotografie del modello fisico stampato in 3D tenuto in mano: vista posteriore con bande bianco/nero e vista frontale nera con speaker a griglia." },
            { file: "10-uso-musica-e-qr", alt: "Due fotografie d’uso: riproduzione musicale con speaker frontali attivi, e schermata con QR code e dettagli di viaggio per il trasporto pubblico." },
            { file: "11-uso-chiamata-e-assistente-vocale", alt: "Due fotografie di un ragazzo che usa il dispositivo: in chiamata tenendolo all’orecchio, e parlando all’assistente vocale IA tenendolo vicino alla bocca." },
            { file: "12-uso-cuffie-e-tasca", alt: "Due fotografie d’uso: ascolto in cuffia con il dispositivo in mano, e il dispositivo riposto nella tasca posteriore dei jeans per mostrarne l’ingombro." },
            { file: "13-ergonomia-grip-sequence", alt: "Sequenza di quattro fotografie della stessa mano che impugna il dispositivo in angolazioni diverse, a illustrare l’ergonomia e la raggiungibilità dello schermo touch con il pollice." },
            { file: "14-mappa-posizionamento-mercato", alt: "Mappa di posizionamento a bolle dei dispositivi di comunicazione mobile: smartphone (iPhone 14), dumbphone (Light Phone, Mudita), wearable, assistenti IA vocali, visori ed interfacce cervello-computer." },
            { file: "15-personas-empathy-map", alt: "Due empathy map affiancate: Martina, studentessa di ingegneria gestionale, e Giulio, studente di psicologia, con le sezioni Cosa pensa, Cosa dice, Cosa sente o prova, Cosa fa." },
            { file: "16-value-proposition-canvas", alt: "Due value proposition canvas affiancate per le persona Martina e Giulio, con le sezioni Product and services, Gain creators, Pains relievers, Gains, Pains, Customer job." }
        ]
    }
};

**Titolo documento**	  Version:           1.00

Analisi di Dettaglio Data Layer SFD Bari	  Data:  18/12/2020


Analisi di Dettaglio Data Layer SFD Bari

**Versione 1.00**


Elenco delle Revisioni al documento

|**Date**|**Version**|**Description**|**Author**|
| - | - | - | - |
|14/02/2021|1.0|Versione iniziale|Marsiglietti, Lunghi|




Sommario

[1	Descrizione generale	3](#_Toc60046652)

[1.1	Descrizione del problema	3](#_Toc60046653)

[1.2	Operatività	3](#_Toc60046654)

[1.3	Attori ed entità	3](#_Toc60046655)

[1.3.1	Operatore webapp SFD	3](#_Toc60046656)

[1.3.2	Operatore del gestionale	3](#_Toc60046657)

[1.3.3	Interventi	3](#_Toc60046658)

[1.3.4	Assistiti	3](#_Toc60046659)

[2	Analisi tecnica	4](#_Toc60046660)

[2.1	Ambiente di sviluppo	4](#_Toc60046661)

[2.2	Architettura generale	4](#_Toc60046662)

[2.3	Meccanismo di autenticazione utente	4](#_Toc60046663)

[3	Utilizzo Postman	4](#_Toc60046664)

[3.1	IMPORT DEL FILE JSON	4](#_Toc60046665)

[3.2	UTILIZZO DELLA COLLECTION	6](#_Toc60046666)

[3.3	FUNZIONALITA’ DELLA SEZIONE  PRINCIPALE	7](#_Toc60046667)

[3.4	UTILIZZO DEI RISULTATI SU BROWSER	11](#_Toc60046668)

[4	Descrizione dei web service da sviluppare	12](#_Toc60046669)

[4.1 Formato della richiesta	12](#_Toc60046670)

[4.2	Formato della risposta	12](#_Toc60046671)

[4.3	Metodo di Login	13](#_Toc60046672)

[4.4	Recupera configurazione	15](#_Toc60046673)

[4.5	Recupera operatore	16](#_Toc60046674)

[4.6	Recupera interventi	19](#_Toc60046675)

[4.7	Genera recupero password	22](#_Toc60046676)

[4.8	Conferma recupero password	23](#_Toc60046677)

[4.9	Modifica password	24](#_Toc60046678)

[4.10	Validazione del assistito	26](#_Toc60046679)

[4.11	Recupero di un intervento specifico	28](#_Toc60046680)

[4.12	Aggiunta di un intervento	29](#_Toc60046681)

[4.13	Modifica di un intervento	31](#_Toc60046682)

[4.14	Recupero degli assistiti	33](#_Toc60046683)

[4.15	Recupero degli assistiti	35](#_Toc60046684)

[4.16	Aggiunta di un assistito	39](#_Toc60046685)

[4.17	Calcolo del Codice Fiscale	41](#_Toc60046686)

[4.18	Ricerca dei valori	43](#_Toc60046687)


Analisi di Dettaglio Progetto SFD Bari

**Descrizione generale**

Descrizione del Data Layer per il progetto SFD Bari. 

**Descrizione del problema**

Il comune di Bari eroga servizi a fruizione diffusa e necessita di una webapp con la quale far inserire ai propri operatori informazioni relative ai servizi erogati e alle persone a cui vengono erogati i servizi.

**Operatività**

Il sistema si compone di due parti:

- Una webapp lato client che fornisce l’interfaccia di inserimento di interventi ed eventualmente assistiti
- Una serie di pagine sul gestionale per vedere quanto inserito con la webapp

**Attori ed entità**

**Operatore webapp SFD**

L’operatore della webapp SFD inserisce i dati degli interventi e degli assistiti

**Operatore del gestionale**

L’operatore del gestionale può vedere i dati inseriti con la webapp all’interno delle sezioni “cartella sociale - interventi” e “anagrafica assistiti” del gestionale.

**Interventi**

Interventi del gestionale di tipo Servizi a Fruizione Diffusa

**Assistiti**

Assistiti così come rappresentati nel gestionale

**Ambiente di sviluppo**

*Visual Studio 2019+* per il server, *Visual Studio Code 1.52+* per il client.

**Architettura generale**

Andremo a sviluppare una webapp che salva i dati sul database del gestionale. Nessun front end sulla parte web del gestionale.

La webapp si comporrà di una parte client scritta in React.js pubblicata su IIS e di una parte server costituita da web service custom (basati sul modello utilizzato in ASSO-ISA, Teambook e Confagricoltura) che accettano e restituiscono stringhe in formato JSON

**Meccanismo di autenticazione utente**

Contestualmente al login nel sistema verrà creato un token, associato in memoria sul server al profilo dell’utente e passato al client tramite il web service di login. Ogni richiesta fatta ai web service dovrà tenere conto di questo cookie e quindi del profilo utente che ha originato la richiesta.

Il token avrà vita limitata nel tempo e compatibile con i tempi di una normale sessione web (es. 60 minuti).

Al logout dell’utente dovrà corrispondere una cancellazione del token e dei dati salvati in memoria sul server.

**Utilizzo Postman**

In questo capitolo andremo a esplorare alcune delle funzionalità di Postman (V.  7.36.0 Win)

**IMPORT DEL FILE JSON**

Per effettuare l’import di **un file JSON** utilizzare il pulsante “**Import**”che si trova in **alto a sinistra nella nav-bar** 

![](Aspose.Words.479e33f1-796f-4f2b-bcbc-71f5a0e9edfa.002.png)

In seguito al click sul bottone si aprirà una **schermata di aggiunta file**, sarà quindi possibile tramite **drag&drop selezionare il file da importare**.

![](Aspose.Words.479e33f1-796f-4f2b-bcbc-71f5a0e9edfa.003.png)



risultato del **drag&drop**:

![](Aspose.Words.479e33f1-796f-4f2b-bcbc-71f5a0e9edfa.004.png)

Cliccare poi sul **bottone “import” arancione in basso a destra** per completare **l’import**.
se l’operazione si è conclusa con **successo** allora si riceverà una **notifica dall’ applicazione** con una spunta verde riportante un messaggio di successo. 

**UTILIZZO DELLA COLLECTION**

![](Aspose.Words.479e33f1-796f-4f2b-bcbc-71f5a0e9edfa.005.png)Una volta importato il file si può andare ad agire su quelli che sono i **metodi che vengono importati.**

nella parte **sinistra dello schermo**, per tutta la lunghezza della finestra possiamo trovare la sezione riportata in immagine qui a sinistra.
Selezionare dalla nav-bar interna la sezione “**Collections**”che farà vedere **uno o più menu a tendina discendente.**


Al interno della sezione selezionata troveremo un elenco di **Collection (i menù a tendina)** che prendono il nome o dal file che abbiamo importato o dalla stringa di testo che forniamo in **fase di creazione manuale (pulsante arancio “+ New Collection”)**.

Spostandoci con il cursore sulla Collection troviamo **3 pulsanti**:
-a sinistra una freccia che indica se la **Collection è aperta o chiusa**.
-a **destra in alto** una freccia con una linea verticale che permette al utente di aprire **un tab con differenti opzioni**, tra cui la **documentazione**, che non andremo ad analizzare in questo documento.

-a **destra in basso** troviamo i **3 punti** che aprono un menù con differenti opzioni per la nostra Collection. Per operazioni di **Rename**,**Edit**,**Delete**,**Duplicate**,**Export** ecc.. utilizzare questo bottone.

![](Aspose.Words.479e33f1-796f-4f2b-bcbc-71f5a0e9edfa.006.png)  *i tre bottoni descritti prima.*

Una volta aperto **il menù a tendina** avremo la possibilità di vedere tutte quelle che sono le differenti **funzioni**.

Tramite click è possibile selezionarne una e aprirla nella **schermata principale** dell’ applicativo.

**FUNZIONALITA’ DELLA SEZIONE  PRINCIPALE**

**Schermata di partenza**

La maggior parte della finestra è occupata dalla tab principale in cui possiamo andare a effettuare svariate operazioni sulle funzioni che selezioniamo nel menù laterale.

***Senza funzioni selezionate troviamo un interfaccia spoglia, le informazioni più utili che possiamo reperire sono relative ai pulsanti sulla destra in alto, sotto la nav-bar nera.***

![](Aspose.Words.479e33f1-796f-4f2b-bcbc-71f5a0e9edfa.007.png)

Partendo da sinistra troviamo, nel **riquadro in rosso**:


DropDownList con gli **Enviroment disponibili** (“Bari - Servizi a fruizione diffusa”);

**Enviroment Quick Look**:
permette la visione rapida di quello che è **l’ambiente di lavoro corrente**:

![](Aspose.Words.479e33f1-796f-4f2b-bcbc-71f5a0e9edfa.008.png)

In questa finestra vengono evidenziate le seguenti caratteristiche del ambiente:

`	`**nome Enviroment**;

`	`**Variabili di Enviroment**;

`	`**Variabili globali**;


`      `***Utilizzeremo le variabili di Enviroment successivamente.***

**Schermata con funzioni**

La prima cosa da fare quando si vogliono utilizzare le **funzioni della Collection** è di andare a **generare il Token di autenticazione**.
Per fare questo è Necessario utilizzare la funzione di “**login**”situata **nella schermata laterale.**

![](Aspose.Words.479e33f1-796f-4f2b-bcbc-71f5a0e9edfa.009.png)

***Utilizziamo il metodo di login per esplorare le funzionalità della schermata.***

Troviamo **in alto** una divisione **a schede** della schermata (“**POST login**”,”**POST getOperatore**”,”**POST modificaPassword**”).
Questa divisione delle tab permette di poter tenere aperte più funzioni, e passare facilmente da una all’altra.

Sotto possiamo trovare **in grigio due campi con 2 bottoni a lato**, uno **blu** e uno **grigio**.
la prima (con scritto “**POST**”) permette di **modificare il tipo di richiesta**.
la seconda invece va a puntare con un **URL al Handler in cui sono contenute le funzioni che andremo a richiamare tramite il bottone blu Send**. 

Nel progetto sono presenti **richiami a 2 differenti Handler:**
**/ServiziFruizioneDiffusa.aspx**  - **che si occupa dei dati generici**.
**/ServiziUtente.aspx**  - che si occupa esclusivamente di **dati e funzioni relative al utente e alle sue informazioni.**
nel url è presente anche “{{BASE\_URL}}”.
“{{BASE\_URL}}”.è una  **variabile di enviroment** che viene utilizzata per inserire una parte comune nell’ URL, possiamo vedere il suo **valore andando sopra la variabile con il mouse o andando nella sezione: Enviroment quick look precedentemente vista.** 

Sotto possiamo trovare un'altra sezione a tab, in questa sezione siamo interessati alla **schermata chiamata BODY**.
Le funzioni devono contenere un **Formato di richiesta che presenta caratteristiche specifiche**, che possiamo **trovare nella schermata BODY**.
` `è solitamente richiesto un:
-**Token di autenticazione**: “token” (generato dal **metodo di Login**, il metodo di login **non richiede token di autenticazione**).
-Riferimento **al metodo** da utilizzare **nel Handler** : “method”

-I **parametri** da utilizzare nel **metodo richiamato**.

Andando ad analizzare il **metodo di login** possiamo quindi notare le seguenti cose:
1**.Il token di auth non è necessario** per utilizzare questo metodo.
2.il metodo di login sul Handler **/ServiziFruizioneDiffusa** necessita di **2 parametri di tipo string**:

`	`-**username**

`            `-**password**

È importante osservare anche **i radio Button** che sono posizionati **sopra la text area con i parametri.**
Questi radio button **indicano il formato** in cui si invia la **richiesta al Hander**.

![](Aspose.Words.479e33f1-796f-4f2b-bcbc-71f5a0e9edfa.010.png)

Ancora sotto troviamo un ultima **sezione a tab in cui sono stampati i risultati**.

![](Aspose.Words.479e33f1-796f-4f2b-bcbc-71f5a0e9edfa.011.png)

In questa sezione il tab che ci serve è **il tab “Body”** che è il tab in cui troviamo **il risultato della richiesta.**
per vedere al meglio il nostro risultato è bene **utilizzare la visualizzazione Json dalla DropDownList** con i vari tipi di risultato.

![](Aspose.Words.479e33f1-796f-4f2b-bcbc-71f5a0e9edfa.012.png)

Possiamo quindi vedere che **nel json vi sono 2 oggetti**:
“**Result**” che va a indicare **lo stato** **della richiesta** (successo, errore,ecc..)

“**Data**” Il **risultato effettivo** della richiesta.

***Il risultato di Data per essere visualizzato correttamente deve essere deserializzato.
per fare questo utilizziamo un browser (consigliato Google Chrome).***

**UTILIZZO DEI RISULTATI SU BROWSER**

Apriamo una nuova finestra del browser, clicchiamo con il **tasto destro** sul contenuto della finestra e **selezioniamo “ispeziona” dalla tendina** (su chrome è ispeziona, in altri browser il nome potrebbe cambiare con dei sinonimi).
` `![](Aspose.Words.479e33f1-796f-4f2b-bcbc-71f5a0e9edfa.013.png)

Selezionare **console**.

![](Aspose.Words.479e33f1-796f-4f2b-bcbc-71f5a0e9edfa.014.png)

Scrivere a console l’istruzione **JSON.parse();**

Inserire il **risultato contenuto in data** al interno dell’ istruzione **JSON.parse() e premere invio**

![](Aspose.Words.479e33f1-796f-4f2b-bcbc-71f5a0e9edfa.015.png)
Possiamo quindi **vedere il risultato della nostra richiesta in modo più chiaro e comprensibile.**

**Descrizione dei web service da sviluppare**

**4.1 Formato della richiesta**

Tutte le chiamate ai web service avverranno attraverso un'unica chiamata ad uno specifico metodo così definito:

public override void Execute(string username, string method, string data)

{

`	`<codice dotNet per gestire tutti I metodi del web service>

}

Dove 

- “username” contiene lo username dell’utente loggato
- “method” il metodo del web service che è stato chiamato
- “data” contiene i parametri inviati dal client sotto forma di oggetto JSON

Il json da inviare per chiamare ogni metodo è il seguente:

{

`	`token: "5tf76hbb89d2ax1!qwe5t",

`	`method: "NomeMetodo",

`	`param: <oggetto json>

}

L’oggetto di nome “param” può avere tipo qualsiasi; in ogni metodo descritto sotto sarà dettagliato il corrispondente oggetto param.

**Formato della risposta**

Similmente a quanto accade nella richiesta anche nella risposta dei vari web service dobbiamo chiamare sempre lo stesso metodo:

SetResponse(bool resultSuccess, int resultCode, string resultMessage, object data)

Che restituirà al client il seguente json:

{

`	`data: <oggetto json>,

`	`result: {

`		`success: false,

`		`code: 230,

`		`message: “Errore nel salvataggio”

}

}

**NOTA**: Il codice di errore in caso di login, che va gestito separatamente dagli altri errori, è il .

La proprietà “message” dell’oggetto “result” può avere valori significativi sia in caso di success “true” (considerato messaggio di warning) che di success “false” (dove diventa la spiegazione dell’errore).

**Metodo di Login**

Nome Metodo : **login**

Metodo che accetta in ingresso due parametri (username e password) e restituisce un token di sessione nell’oggetto *data.token*.

{ token: "", method: "login", param: { username: username, password: password, }};

Esempio di response:

{

`	`data: {token: “stringatoken”},

`	`result: {

`		`success: true,

`		`code: 200,

`		`message: “”

}

}

**NOTA**: per effettuare il login come utente anonimo bisogna effettuare la chiamata con username e password vuoti, il sistema restituirà sempre un token valido per tutti gli utenti non loggati. Questo comportamento deve essere configurato attraverso la configurazione della PDI tramite il parametro **HANDLER\_SERVIZI\_ANONYMOUS\_ACCESS\_ENABLED** = true. 

E’ possibile identificarsi come utente internet generico anche senza autenticarsi passando un token preconfigurato recuperabile sempre dalla configurazione della PDI. 

In questo progetto non saranno accettate chiamate anonime o di utente internet generico. 

Le tipologie di errore specifiche per l’autenticazione sono le seguenti:

1. Login fallito, **codice 401**
1. Primo accesso (occorre modificare la password), **codice 301**
1. Password scaduta (occorre modificare la password), **codice 302**
1. Errore di login non gestito, **codice 500** (stesso codice del codice di errore generico)

Gli errori del login **non** vengono loggati sul server. 

In caso di modifica password occorre chiamare il login con un parametro aggiuntivo, la nuova password, come nell’esempio seguente. 

{ 

token: "", 

method: "login", 

param: { 

username: username, 

password: password, 

nuova\_password: nuovapassword 

}

};

Esempio di response:

{

`	`data: null,

`	`result: {

`		`success: true,

`		`code: 0,

`		`message: “Cambio password eseguito”

}

}

Le tipologie di errore specifiche per la modifica password sono:

1. Cambio password fallito **codice 402**

L’errore **viene** salvato dentro a t\_dblogger. 

**Recupera configurazione**

Nome Metodo : **getConfigurazione**

**Introduzione:**

Con questo metodo del web service si recuperano alcuni dati utilizzati nel resto della webapp, come ad esempio:

- L’elenco dei generi sessuali
- L’elenco delle professioni sceglibili in fase di inserimento di un assistito
- L’elenco degli status lavorativi (sempre per inserimento assistiti)

**HandlerPath:**

**{{BASE\_URL}}/ServiziFruizioneDiffusa.aspx**

**Formato della richiesta:**

{

`	`token: "5tf76hbb89d2ax1!qwe5t",

`	`method: " getConfigurazione",

`	`param: null

}

**Valore di ritorno:**

{

`    `"genere": [ { “**id**”: 2, “**nome**”: “Femmina” },

`		  `{ “**id**”: 1, “**nome**”: “Maschio” } ],

`    `"professioni": [ { “**id**”: 171, “**nome**”: “01\_Sconosciuta” },

`		  	`{ “**id**”: 174, “**nome**”: "02\_Disoccupato/Inoccupato" } ],

`    `"statusLavorativo": [ { “**id**”: 642, “**nome**”: “03\_Età prescolare” },

`		  	   `{ “**id**”: 164, “**nome**”: "04\_Studente" } ]

} 

**Recupera operatore**

Nome Metodo : **getOperatore**

**Introduzione:**

Con questo metodo del web service si recuperano alcuni dati utilizzati nel resto della webapp relativi al **operatore**:

- **Nome**,**Cognome**,**ID** e **CF** 
- L’elenco delle **strutture** e delle relative **aree di intervento**
- Gli **ambiti** al interno delle **aree di intervento**
- Per ogni **ambito** vengono restituiti anche i **servizi**

Questo permetto di costruire graficamente una **tripletta di liste** per la scelta del **servizio**.
questa **alberatura** è già filtrata sulla base del **operatore**.

**HandlerPath:**

**{{BASE\_URL}}/ServiziFruizioneDiffusa.aspx**

**Formato della richiesta:**

{

`	`token: "{{ACCESS\_TOKEN}}",

`	`method: " getOperatore",

`	`param: {}

}

**Valore di ritorno:**

{

`    	 `"**operatore**": 

` `{ 

`   	   `“**id**”: 475,

`   	   `“**nome**”: “MARIO”,

`   	   `“**cognome**”: “ROSSI”, 

`   	   `“**codiceFiscale**”: “RSSMRA30A01H501I”

` `},

`    	 `**"strutture":** 

`        `**[** 

`          `**{** 

`            `**“id”:** 388,

`            `“**nome**”: “CAPS - COOPERATIVA SOCIALE A.R.L” },

`            `“**areeIntervento**”

`	     `[

`	        `{

`                 `“**id**”: 2,

`                 `“**nome**”: "01 - Minori e famiglia",

`                  `“**ambiti**”:

`                  `[

`			`{

`                         `“**id**”: 2,

`                         `“**nome**”: "01 - Welfare d'accesso",

`                         `“**servizi**”: 

`                          `[

`                             `{

`				   `“**id**”: 24,

`                                `“**nome**”: "Servizio di Pronto Intervento Sociale (PIS)"

`                             `}

`                          `]

`                      `}

`                  `]

`               `}

`            `]

`        `}   

`     `]

} 

**Tipologie di flussi alternativi registrati:**

**-Nessuna registrata**

**Recupera interventi**

Nome Metodo : **getInterventi**

**Introduzione:**

Con questo metodo del web service si recuperano alcuni dati utilizzati nel resto della webapp relativi agli **interventi** sulle **strutture** richieste nel **parametro specificato nella richiesta**:

- **Dati generici** su **operatore** e **data intervento**
- Viene anche fornita **area** ,**ambito** e **servizio** relativi al intervento

**HandlerPath:**

**{{BASE\_URL}}/ServiziFruizioneDiffusa.aspx**

**Formato della richiesta:**

{

`	`token: "{{ACCESS\_TOKEN}}",

`	`method: " getInterventi",

`	`param: 

`       `{

`        `"**idStruttura**": int,

`        `"**filtro**": 

`        `{

`            `"**cognome**": "...",

`            `"**nome**": "...",

`            `"**codiceFiscale**": "...",

`            `"**dataIntervento**": 

`            `{

`                `"**inizio**": "...",

`                `"**fine**": "..."

`            `}

`        `},

`        `"**ordinamento**": 

`        `{

`            `"**field**": "...",

`            `"**asc**": bool

`        `},

`        `"**paginazione**": 

`        `{

`            `"**page**": int,

`            `"**limit**": int

`        `}

`     `}

}

**Valore di ritorno:**

{

`    	 `"**page**": 1,

`    	 `**"count": 1,** 

`        `**"**items**":**

`        `**[** 

`	        `{

`                 `“**id**”: 1,

`                 `“**nome**”: "Mario",

`                  `“**cognome**”: “Rossi”,

`		   `“dataNascita”: 01-01-1990,

`                 `“codiceFiscale”: " RSSMRA30A01H501I",

`                  `“dataInizioIntervento”: “01-01-1999”,

`                 `“dataFineIntervento”: “01-01-2000”,

`                 `“area”: 

{

`   `“Ambiti”: null

`   `“id”: 1,

`   `“nome”: “Area 1”

},

`   `“ambito”: 

{

`   `“servizi”: null

`   `“id”: 1,

`   `“nome”: “Ambito 1”

},

`   `“servizio”: 

{

`   `“id”: 1,

`   `“nome”: “Servizio 1”

}

`               `}

`        `]

} 


**Tipologie di flussi alternativi registrati:**

**-1. Lista vuota**

{"result":{"success":true,"code":0,"message":null},"data":"{\"page\":1,\"count\":0,\"items\":[]}"}

**Causa:**

non ci sono interventi validi per la struttura selezionata.

**Genera recupero password**

Nome Metodo : **generaRecuperoPassword**

**Introduzione:**

Con questo metodo del web service si invia tramite e-mail un codice di recupero della password 

- il sistema richiederà una conferma della richiesta di recupero password tramite codice. 
- Il codice viene successivamente utilizzato per il metodo confermaRecuperoPassword  (capitolo 4.9);

Viene fatta questa procedura per il recupero password per garantire un livello di sicurezza maggiore.

**HandlerPath:**

**{{BASE\_URL}}/ServiziUtente.aspx**

**Formato della richiesta:**

{

`	`token: "68B100FC-41D5-4AEF-8BCE-87D95E29C748",

`	`method: " generaRecuperoPassword",

`	`param: 

`       `{

`        `"**user**": “bari”,

`        `"**email**": “prova@prova.it”



`       `}

}

**Valore di ritorno:**

{

`    `"**Esito**": true,

`    `**"Messaggio":** string

}

**Tipologie di flussi alternativi registrati:**

**-1. utente non trovato**

{

`    `"**Esito**": false,

`    `**"Messaggio":** “nessun utente trovato”

}

**Causa:**

non vengono trovati utenti.

**Conferma recupero password**

Nome Metodo : **confermaRecuperoPassword**

**Introduzione:**

Questo metodo del web service lavora in seguito a **generaRecuperoPassword (4.8**), utilizzando il codice univoco che viene fornito con l’e-mail inviata dal precedente metodo.

La sua funzionalità è quella di andare a verificare che il recupero della password sia effettivamente stato richiesto dal utente corretto.

**Viene quindi fornita una password temporanea da reimpostare al primo accesso.**

Viene fatta questa procedura per il recupero password per garantire un livello di sicurezza maggiore.

**HandlerPath:**

**{{BASE\_URL}}/ServiziUtente.aspx**

**Formato della richiesta:**

{

`	`token: "68B100FC-41D5-4AEF-8BCE-87D95E29C748",

`	`method: " confermaRecuperoPassword",

`	`param: 

`       `{

`        `"**code**": “39-663922”

`       `}

}

**Valore di ritorno:**

{

`    `"**Esito**": true,

`    `**"Messaggio":** string

}

**Tipologie di flussi alternativi registrati:**

**-1. Codice non valido**

{

`    `"**Esito**": false,

`    `**"Messaggio":** “Codice non valido”

}

**Causa:**

il codice fornito non è valido.

**-2. Codice non impostato**

{"result":{"success":false,"code":500,"message":"Codice non impostato"},"data":"{\"Esito\":false,\"Messaggio\":\"Codice

non impostato"}"}

**Causa:**

Non viene passato nessun codice al parametro.

`   `**Modifica password**

Nome Metodo : **modificaPassword**

**Introduzione:**

Questo metodo del web service lavora in seguito a **confermaRecuperoPassword (4.9**), utilizzando la password temporanea che viene fornita con la convalida del utente tramite codice univoco

- La password temporanea viene utilizzata per effettuare il login
- Effettuato il login viene richiesta la modifica della password, se questa modifica va a buon fine allora la password selezionata viene impostata come nuova password, la password temporanea quindi scade e viene sostituita con una permanente.
- Il metodo va quindi a modificare effettivamente la password, fornendo una password non temporanea ma permanente (fino a quando l’utente non ne richiederà il recupero  un'altra volta).

**HandlerPath:**

**{{BASE\_URL}}/ ServiziFruizioneDiffusa.aspx**

**Formato della richiesta:**

{

`	`token: "68B100FC-41D5-4AEF-8BCE-87D95E29C748",

`	`method: " login",

`	`param: 

`       `{

`        `"**user**": “bari”,

`        `"**password**": “TMP\_924468”,

`        `"**nuova**\_**password**": “newpass2134”



`       `}

}

**Valore di ritorno:**

{

`    `"**Esito**": true,

`    `**"Messaggio":** string

}

**Tipologie di flussi alternativi registrati:**

**-1. Login fallito**

{

`    `"result": {

`        `"success": **false**,

`        `"code": 401,

`        `"message": "Login fallito"

`    `},

`    `"data": ""

}

**Causa:**

Password temporanea non corretta per l’utente.

`   `**Validazione del assistito**

Nome Metodo : **validaAssistito**

**Introduzione:**

Questo metodo del web service viene utilizzato come step intermedio durante l’aggiunta di un assistito per verificare la correttezza dei dati inseriti e evitare futuri errori.

**HandlerPath:**

**{{BASE\_URL}}/ ServiziFruizioneDiffusa.aspx**

**Formato della richiesta:**

{

`	`token: " *{{ACCESS\_TOKEN}}*",

`	`method: " validaAssistito",

`	`param: 

`       `{

`        `"**cognome**": “string”,

`        `"**nome**": “string”,

`        `"**codiceFiscale**": “XXXXXXXXXXCF”,

`        `“sesso”: 

`               `{

`                   `“id”: 1,

`                   `“nome”: “M”

`               `},

`        `"**dataNascita**": "1992-11-12",

`        `"**luogoNascita**": 

`           `{

`            `"**nazione**": 

`            `{

`                `"**id**": 108,

`                `"**nome**": "SPAGNA"

`            `},

`            `"**provincia**": "",

`            `"**comune**": "",

`                `"**comuneEstero**": "Mataro"

`        `},

`        `"**luogoResidenza**": 

`        `{

`            `"**nazione**": 

`            `{

`                `"**id**": 5,

`                `"**nome**": "ITALIA"

`            `},

`            `**"provincia":** 

`            `{

`                `"**id**": 52,

`                `"**nome**": "Modena"

`            `},

`            `"**comune**": 

`            `{

`                `"**id**": 6809,

`                `"**nome**": "MODENA"

`            `},

`            `"**indirizzo**": "Via C. Zucchi",

`            `"**numeroCivico**": "21",

`            `"**cap**": "41123"

`        `},

`       `"**statusLavorativo**": 

`        `{

`            `"**id**": 2477,

`            `"**nome**": "10\_Dipendente full-time tempo indeterminato"

`        `},

`        `"**professioneCorrente**": 

`        `{

`            `"**id**": 169,

`            `"**nome**": "15\_Impiegato/a"

`        `},

`        `"**professionePrecedente**": 

`        `{

`            `"**id**": 169,

`            `"**nome**": "15\_Impiegato/a"

`        `},

`        `"**invalidita**": 

`        `{

`            `"**presente**": **false**,

`            `"**percentuale**": 0

`        `}





`       `}

}

**Valore di ritorno:**

{

`    `"**Result**":

`	`{

`	`"**success**": **true**,

`        `"**code**": 0,

`        `"**message**": **null**

`	`}

`    `**"data":** “{\”errors\”:[]}”

}

**Tipologie di flussi alternativi registrati:**

**- Nessuna registrata**

`   `**Recupero di un intervento specifico** 

Nome Metodo : **getIntervento**

**Introduzione:**

Quando questo metodo del web service viene richiamato si passano a parametro della richiesta degli ID specifici che vanno a fornire le “coordinate” per il recupero di un intervento specifico

**HandlerPath:**

**{{BASE\_URL}}/ ServiziFruizioneDiffusa.aspx**

**Formato della richiesta:**

{

`	`token: " *{{ACCESS\_TOKEN}}*",

`	`method: " getIntervento",

`	`param: 

`       `{

`        `"**idStruttura**": 388,

`        `"**id**": 57417,



`       `}

}

**Valore di ritorno:**

{

`    `"**ambito**": null,

`    `**"area":** null,

`    `"**assistito**": null,

`    `**"attivitaLavorativa":** null,

`    `"**attivitaLavorativaPrecedente**": null,

`    `**"dataFineIntervento":** null,

`    `"**dataInizioIntervento**": null,

`    `**"id":** 0

`    `"**invalidita**": null,

`    `**"note":** null

`    `"**numeroComponenti**": 0,

`    `**"presenzaAnziani":** false,

`    `"**presenzaDisabili**": false,

`    `**"servizio":** null,

`    `"**titolo**": null,

}

**Tipologie di flussi alternativi registrati:**

**-Nessuna registrata**

`   `**Aggiunta di un intervento**

` `Nome Metodo : **aggiungiIntervento**

**Introduzione:**

Quando questo metodo del web service viene richiamato si passa a parametro un intervento che verrà poi registrato.

**HandlerPath:**

**{{BASE\_URL}}/ ServiziFruizioneDiffusa.aspx**




**Formato della richiesta:**

{

`	`token: " *{{ACCESS\_TOKEN}}*",

`	`method: " getIntervento",

`	`param: 

`       `{

`        `"**idStruttura**": 388,

`        `"**assistito**": {

`            `"**id**": 163422,

`            `"**cognome**": "TRANCOSO",

`            `"**nome**": "CARLOS",

`            `"**dataNascita**": "12-11-1992",

`            `"**codiceFiscale**": "TRNCLS92S12Z131O",

`            `"**fonteDati**": "gestionale"

`        `},

`        `“interventi”: 

`          `[

`             `{

`                `"**area**": {

`                    `"**id**": 2,

`                    `"**nome**": "01 - Minori e famiglia"

`                `},

`                `"**ambito**": {

`                    `"**id**": 204,

`                    `"**nome**": "01 - Welfare d'accesso"

`                `},

`                `"**servizio**": {

`                    `"**id**": 24,

`                    `"**nome**": "Servizio di Pronto Intervento Sociale (PIS) ex Art.85"

`                `},

`                `"**dataInizioIntervento**": "2020-12-18",

`                `"**dataFineIntervento**": "2020-12-31",

`                `"**titolo**": "Test",

`                `"**attivitaLavorativa**": {

`                    `"**id**": 171,

`                    `"**nome**": "01\_Sconosciuta"

`                `},

`                `"**presenzaAnziani**": false,

`                `"**presenzaDisabili**": false,

`                `"**attivitaLavorativaPrecedente**": {

`                    `"**id**": 171,

`                    `"**nome**": "01\_Sconosciuta"

`                `},

`                `"**numeroComponenti**": 2,

`                `"**invalidita**": {

`                    `"**presente**": false,

`                    `"**percentuale**": 0

`                `},

`                `"**note**": "Note test"

`            `}

`          `]



`       `}

}

**Valore di ritorno:**

{

`    `"**result**": 

`     `{

`         `“**success**”: true,

`         `“**code**”: 0,

`         `“**message**”: null

`     `},

`    `**"data": “{}”**

}

**Tipologie di flussi alternativi registrati:**

**-Nessuna registrata**

`   `**Modifica di un intervento**

Nome Metodo : **modificaIntervento**

**Introduzione:**

Quando questo metodo del web service viene richiamato si passa a parametro un intervento che verrà poi modificato.

**HandlerPath:**

**{{BASE\_URL}}/ ServiziFruizioneDiffusa.aspx**




**Formato della richiesta:**

{

`	`token: " *{{ACCESS\_TOKEN}}*",

`	`method: " modificaIntervento",

`	`param: 

`       `{

`        `"**idStruttura**": 388,

`        `"**intervento**": {

`            `"**id**": int,

`            `"**dataInizioIntervento**": "TRANCOSO",

`            `"**dataFineIntervento**": "CARLOS",

`            `"**area**": 

`                  `{

`                     `"**id**": 2,

`                     `"**nome**": "01- Minori e famiglia",

`                     `"**ambiti**": []

`                  `},

`            `"**ambito**": 

`                  `{

`                     `"**id**": 2,

`                     `"**nome**": "01- welfare d’accesso ",

`                     `"**servizi**": []

`                  `},

`            `"**servizio**": 

`		   `{

`                     `"**id**": 2,

`                     `"**nome**": "Servizio di Pronto Intervento Sociale (PIS) ex Art.85"

`                  `},

`            `"**titolo**": “test”,

`            `"**note**": "test",

`            `"**numeroComponenti**": 2,

`            `"**attivitaLavorativa**": 

`		   `{

`                     `"**id**": 171,

`                     `"**nome**": "01\_Sconosciuta"

`                  `},

`	     `"**attivitaLavorativaPrecedente**": 

`		   `{

`                     `"**id**": 171,

`                     `"**nome**": "01\_Sconosciuta"

`                  `},

`             `"**invalidita**": 

`		   `{

`                     `"**presente**": false,

`                     `"**percentuale**": 0

`                  `},

`     `"**presenzaAnziani**": false,

`            `"**presenzaDisabili**": false,

`            `"**assistito**": null,

`        `},

`       `“**assistito**”:

`            `{

`            `"**id**": 163422,
`            `“**cognome**": "TRANCOSO",
`            `"**nome**": "CARLOS",
`            `"**dataNascita**": "1992-11-12",
`            `"**codiceFiscale**": "TRNCLS92S12Z131O",
`            `"**fonteDati**": "gestionale"
`     `}        

}

**Valore di ritorno:**

{

`    `"**result**": 

`     `{

`         `“**success**”: true,

`         `“**code**”: 0,

`         `“**message**”: null

`     `},

`    `**"data": “{}”**

}

**Tipologie di flussi alternativi registrati:**

**-Nessuna registrata**

`   `**Recupero degli assistiti**

Nome Metodo : **getAssistiti**



**Introduzione:**

Quando questo metodo del web service viene richiamato la richiesta al Handler **fornisce una lista di assistiti**.
questa lista viene fornita seguendo queste indicazioni:
-**Filtro**: il filtro sulla ricerca viene applicato al **Cognome,Nome,Codice fiscale**;

-**Ordinamento**: si richiede il **parametro da utilizzare per fare l’ordinamento della lista fornita**, in seguito si chiede se i valori di questo parametro saranno utilizzati per **disporre la lista in modo ascendente o discendente.**

-**Paginazione**: Vengono forniti dei parametri **per limitare il numero di elementi della lista e la loro organizzazione.**

**HandlerPath:**

**{{BASE\_URL}}/ ServiziFruizioneDiffusa.aspx**

**Formato della richiesta:**

{

`	`token: " *{{ACCESS\_TOKEN}}*",

`	`method: " getAssistiti",

`	`param: 

`       `{

`        `"**filtro**": 

{

`            	  `“**cognome**": “Mario”,

`            	  `"**nome**": "Rossi",

`            	  `"**codiceFiscale**": "XXXXXX",

},

`	 `"**ordinamento**": 

{

`            	  `“**field**": “nome”,

`            	  `"**asc**": false

},

"**ordinamento**": 

{

`            	  `“**page**": 1,

`            	  `"**limit**": 20

}


`       `}

}

**Valore di ritorno:**

{

`    `"**items**": 

[

`     `{

`         `“**codiceFiscale**”: “XXXXXXXXXXX”,

`         `“**cognome**”: “Rossi”,

`         `“**dataNascita**”: “11-09-1998”,

`         `“**fonteDati**”: “gestionale”,

`         `“**id**”: 1,

`         `“**nome**”: “Mario”

`     `}

],

`    `**"count":** 0,

`    `**"page":** 0,

}

**Tipologie di flussi alternativi registrati:**

**-Nessuna registrata**

`   `**Recupero degli assistiti**

Nome Metodo : **getAssistito**

**Introduzione:**

Quando questo metodo del web service viene richiamato la richiesta al Handler **fornisce l’assistito richiesto tramite parametri forniti nel formato della richiesta**

**HandlerPath:**

**{{BASE\_URL}}/ ServiziFruizioneDiffusa.aspx**

**Formato della richiesta:**

{

`	`token: " *{{ACCESS\_TOKEN}}*",

`	`method: " getAssistiti",

`	`param: 

`       `{

`        `"**id**": int //riferimento a ID assistito

`	 `"**codiceFiscale**": “XXXXXXXXX”

`       `}

}

**Valore di ritorno:**

{

`    `"**cittadinanza**": 

`     `{

`         `“**id**”: “332”,

`         `“**nome**”: “NAZIONALITA”

`     `},

`    `**"codiceFamiglia":** null,

`    `**"codiceFiscale":** “XXXXXXXX”,

`    `**"cognome":** “Rossi”,

`    `**"dataNascita":** “11-09”,

`    `**"fonteDati":** “gestionale”,

`    `**"id": int**,

`    `**"invalidita":** null,

`    `**"luogoNascita":** 

{

`  `“**comune**”: 

{

`  `“**id**”: 0,

`  `“**nome**”: “”

},

`  `“**comuneEstero**”: “Mataro”,

`  `“**nazione**”: 

{

`  `“**id**”: 108,

`  `“**nome**”: “NAZIONE”

},

`  `“**provincia**”: 

{

`  `“**id**":0

`  `“**nome**”: “”

}

},

**"luogoResidenza":**

**{**

`		`**“cap”:**0
**
`	`“**comune**”: 

{

`  `“**id**”: 0,

`  `“**nome**”: “”

},

“**indirizzo**”: “”,

`  	`“**nazione**”: 

{

`  `“**id**”: 108,

`  `“**nome**”: “NAZIONE”

},

`  	`“**provincia**”: 

{

`  `“**id**":0

`  `“**nome**”: “”

},

“**numeroCivico**”: “”

**},**

**"nome":** “Mario”**,**

**"professioneCorrente":**

**{**

`	`**“id”:** 0**,**

`	`**“nome”:** null

**},**

**"professionePrecedente":**

**{**

`	`**“id”:** 0**,**

`	`**“nome”:** null

**},**

**"sesso":**

**{**

`	`**“id”:** 1**,**

`	`**“nome”:** “M”

**},**

**"statusLavorativo":**

**{**

`	`**“id”:** 0**,**

`	`**“nome”:** null

**}**

}

**Tipologie di flussi alternativi registrati:**

**-Nessuna registrata**

`   `**Aggiunta di un assistito**

Nome Metodo : **aggiungiAssistito**

**Introduzione:**

Quando questo metodo del web service viene richiamato la richiesta al Handler fa si che un **nuovo assistito venga aggiunto** utilizzando come valori **i parametri forniti dal formato della richiesta.**

**HandlerPath:**

**{{BASE\_URL}}/ ServiziFruizioneDiffusa.aspx**

**Formato della richiesta:**

{

`	`token: " *{{ACCESS\_TOKEN}}*",

`	`method: " aggiungiAssistito",

`	`param: 

`       `{

`  `“**cognome**": “Rossi”,

`         `“**nome**”: “Mario”,

`         `“**codiceFiscale**”: “XXXXXX”,

`         `“**sesso**":

{

`            	  `“**id**": 1,

`            	  `"**nome**": "M"
`              `},

`        `“**dataNascita**”: “XXXXXX”,


`	 `"**luogoNascita**": 

{

`            	  `“**nazione**": 

{

`  `“**id**”: 108,

`  `“**nome**”: “NAZIONE”

},

`            	  `"**provincia**": “”,

`  `"**comune**": “”,

`  `"**comuneEstero**": “Mataro”,

},

"**luogoResidenza**": 

**{**

`		`**“cap”:**41123
**
`	`“**comune**”: 

{

`  `“**id**”: 0,

`  `“**nome**”: “”

},

“**indirizzo**”: “Via C. Zucchi”,

`  	`“**nazione**”: 

{

`  `“**id**”: 108,

`  `“**nome**”: “NAZIONE”

},

`  	`“**provincia**”: 

{

`  `“**id**":0

`  `“**nome**”: “”

},

“**numeroCivico**”: “21”

**}**

`       `}

"**statusLavorativo**": 

{

`	 `"**id**": 2477,

`        `"**nome**": "10\_Dipendente full-time tempo indeterminato"

},



“**professioneCorrente**”:

{

` `"**id**": 169,

` `"**nome**": "15\_Impiegato/a"

},

“**professionePrecedente**”

{

"**id**": 169,

"**nome**": "15\_Impiegato/a"

},

"**invalidita**": 

{

"**presente**": false,

"**percentuale**": 0

}

`   `}

}

**Valore di ritorno:**

{

`    `"**codiceFiscale**": “XXXXXXXX”,

`    `**"cognome":** “Rossi”,

`    `**"dataNascita":** “1992-11-12”,

`    `**"id":** “163425”,

`    `**"nome":** “Mario”

}

**Tipologie di flussi alternativi registrati:**

**-Nessuna registrata**

`   `**Calcolo del Codice Fiscale**

Nome Metodo : **aggiungiAssistito**

**Introduzione:**

Quando questo metodo del web service viene richiamato la richiesta al Handler fa si che un **nuovo assistito venga aggiunto** utilizzando come valori **i parametri forniti dal formato della richiesta.**

**HandlerPath:**

**{{BASE\_URL}}/ ServiziFruizioneDiffusa.aspx**



**Formato della richiesta:**

{

`	`token: " *{{ACCESS\_TOKEN}}*",

`	`method: " calcolaCodiceFiscale",

`	`param: 

`       `{

“**cognome**": “Rossi”,

“**nome**”: “Mario”,

“**sesso**": “M”

“**dataNascita**”: “01-01-1925”,

`	 	`"**luogoNascita**": 

{

`            	  		`“**nazione**": 

{

`  						`“**id**”: 108,

`  						`“**nome**”: “NAZIONE”

},

`            	  		`"**provincia**": 

{

`  						`“**id**”: 108,

`  						`“**nome**”: “PROVINCIA”

},

"**comune**":

{

`  						`“**id**”: 108,

`  						`“**nome**”: “PROVINCIA”

}

}

`	`}

**Valore di ritorno:**

{

"**result**": 

`     `{

`         `“**success**”: true,

`         `“**code**”: 0,

`         `“**message**”: null

`     `},

`    `**"data":** 

**“{**

`	`**“codiceFiscale”: “XXXXXXXXXXXXXXXX”**

**}”**

}

` `**Ricerca dei valori**

Nome Metodo : **ricercaValori**

**Introduzione:**

Quando questo metodo del web service viene richiamato la richiesta al Handler fa si che venga prodotta una lista di valori in base al tipo e alla ricerca effettuati.

**HandlerPath:**

**{{BASE\_URL}}/ ServiziFruizioneDiffusa.aspx**

**Formato della richiesta:**

{

`	`token: " *{{ACCESS\_TOKEN}}*",

`	`method: " ricercaValori",

`	`param: 

`       `{

`        `"**ricerca**": “”

`	 `"**tipo**": “”

`       `}

}

**Valore di ritorno:**

{

"**result**": 

`     `{

`         `“**success**”: true,

`         `“**code**”: 0,

`         `“**message**”: “ok”

`     `},

`    `**"data":** 

**“{**

`	`**“items”:**

`		`**[**

`			`**{**

`			`**“id”: int,**

`			`**“nome”: “”**

`			`**}**

`		`**]**

**}”**

}

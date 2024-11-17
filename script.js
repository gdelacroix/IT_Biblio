let options = {
  weekday: "long",
  year: "numeric",
  month: "long",
  day: "numeric",
};
let booksList = new Array();
let authorsList = new Array();
let categoriesList = new Array();


window.addEventListener("DOMContentLoaded", jsonOnLoad);




listAuthors = document.getElementById("listAuthors");
listAuthors.addEventListener("change", ChargeByAuthor);



listCategories = document.getElementById("listCategories");
listCategories.addEventListener("change", ChargeByCategory);

function jsonOnLoad() {
  fetch("books.json")
    .then((response) => {
      /* Une fois que le fichier est chargé */
      return response.json(); /* Convertissons le en json */
    })
    .then((data) => {
      /* Une fois le fichier converti */
      createList(data); /* Appelons notre fonction */
    });
}

//fonction qui créé les listes déroulantes et le tableau de tous les livres
function createList(data) {
  //on boucle sur l'ensemble des livres
  for (let x = 0; x < data.length; x++) {
    let book = data[x];
    booksList.push(book);

    //on boucle sur les auteurs d'un livre
    for (let y = 0; y < book.authors.length; y++) {
      let author = book.authors[y];

      //On vérifie si l'auteur en question n'est pas déjà dans la liste
      if (authorsList.indexOf(author) == -1) {
        authorsList.push(author);
      }
    }

    //on boucle sur les catégories d'un livre
    for (var y = 0; y < book.categories.length; y++) {
      let category = book.categories[y];
      //On vérifie si la catégorie en question n'est pas déjà dans la liste
      if (categoriesList.indexOf(category) == -1) {
        categoriesList.push(category);
      }
    }
  }

  //tri alphabétique des listes
  booksList.sort();
  authorsList.sort();
  categoriesList.sort();

  for (let x = 0; x < authorsList.length; x++) {
    let option = document.createElement("option");
    option.value = authorsList[x];
    option.innerText = authorsList[x];
    document.getElementById("listAuthors").appendChild(option);
  }
  for (let x = 0; x < categoriesList.length; x++) {
    let option = document.createElement("option");
    option.value = categoriesList[x];
    option.innerText = categoriesList[x];
    document.getElementById("listCategories").appendChild(option);
  }
  showBooks(booksList); /* Appelons notre fonction */
}

//fonction qui charge les livres dans le html dans des card
function showBooks(List) {
  document.getElementById("booksList").innerHTML = "";
  for (let y = 0; y < List.length; y++) {
    let bookListe = document.createElement("div");
    bookListe.setAttribute("class", "card");
    if (List[y].thumbnailUrl == undefined || List[y].thumbnailUrl == null) {
      List[y].thumbnailUrl =
        "https://p1.storage.canalblog.com/14/48/1145642/91330992_o.png";
    }

    let titre;
    if (List[y].title.length > 20) {
      titre = List[y].title.substring(0, 20) + " (...)";
    } else {
      titre = List[y].title;
    }

    let description;
    let descriptionshort;

    if (
      List[y].shortDescription == undefined ||
      List[y].shortDescription == null
    ) {
      description = "Pas de description";
      descriptionshort = "Pas de description";
    } else {
      if (List[y].shortDescription.length > 100) {
        description = List[y].longDescription;
        descriptionshort = List[y].shortDescription.substring(0, 100) + " (...)";
      } else {
        description = List[y].longDescription;
        descriptionshort = List[y].shortDescription;
      }
    }

    let datePubli;

    try {
      datePubli = new Date(List[y].publishedDate.dt_txt).toLocaleDateString(
        "fr-FR",
        options
      );
    } catch (error) {
      datePubli = "Pas de date de publication";
    }

    bookListe.innerHTML =
      '<img src="' +
      List[y].thumbnailUrl +
      '"/>' +
      '<h1 class="booktitle"> <span class="infobulle" title="' +
      List[y].title +
      '">' +
      titre +
      "</span></h1>" +
      '<h2 class="category">' +
      List[y].categories +
      "</h2> " +
      '<h4 class="category">' +
      datePubli +
      "</h4> " +
      '<h4 class="category"> <span class="infobulle" title="' +
      description +
      '">' +
      descriptionshort +
      "</span></h4> ";

    document.getElementById("booksList").appendChild(bookListe);
  }
}

//fonction qui renvoie les livres selon la sélection de l'auteur
function ChargeByAuthor() {
  var e = document.getElementById("listAuthors");
  console.log(e);
  //on récupère le choix de l'auteur
  var strAuthors = e.options[e.selectedIndex].text;
  var authorsBookList = new Array();
  if (strAuthors == "") {
    //si pas de choix
    showBooks(booksList);
  } else {
    //sinon on va boucler sur l'ensemble des livres contenu dans la liste booksList et vérifier les auteurs
    //pour créer une nouvelle liste authorsBookList
    for (var x = 0; x < booksList.length; x++) {
      let bookByAuthor = booksList[x];
      console.log(x.toString() + " - Auteur à chercher:" + strAuthors);

      if (bookByAuthor.authors.indexOf(strAuthors) != -1) {
        console.log("OK");
        authorsBookList.push(bookByAuthor);
      }
    }

    authorsBookList.sort();
    //on pousse cette nouvelle liste authorsBookList à la méthode qui va nous créé notre contenu
    showBooks(authorsBookList);
  }
}

//fonction qui renvoie les livres selon la catégorie
function ChargeByCategory() {
  var e = document.getElementById("listCategories");
  //on récupère le choix de la catégorie
  var strCategory = e.options[e.selectedIndex].text;
  var categoryBookList = new Array();
  if (strCategory == "") {
    //si pas de choix
    showBooks(booksList);
  } else {
    //sinon on va boucler sur l'ensemble des livres contenu dans la liste booksList et vérifier les catégories
    //pour créer une nouvelle liste categoryBookList
    for (var x = 0; x < booksList.length; x++) {
      let bookByCategory = booksList[x];

      if (bookByCategory.categories.indexOf(strCategory) != -1) {
        console.log("OK");
        categoryBookList.push(bookByCategory);
      }
    }
    categoryBookList.sort();
    //on pousse cette nouvelle liste categoryBookList à la méthode qui va nous créé notre contenu
    showBooks(categoryBookList);
  }
}

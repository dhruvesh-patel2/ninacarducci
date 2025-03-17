const mauGallery = function() {
  // Configuration par défaut
  this.defaults = {
    columns: 3,
    lightBox: true,
    lightboxId: null,
    showTags: true,
    tagsPosition: "top", // Modifié de "bottom" à "top"
    navigation: true
  };

  // Méthodes
  this.methods = {
    createRowWrapper(element) {
      if (!element.querySelector('.row')) {
        const rowDiv = document.createElement('div');
        rowDiv.className = 'gallery-items-row row';
        element.appendChild(rowDiv);
      }
    },
    wrapItemInColumn(element, columns) {
      if (columns.constructor === Number) {
        const column = document.createElement('div');
        column.className = `item-column mb-4 col-${Math.ceil(12 / columns)}`;
        element.parentNode.insertBefore(column, element);
        column.appendChild(element);
      } else if (columns.constructor === Object) {
        let columnClasses = "item-column mb-4";
        if (columns.xs) {
          columnClasses += ` col-${Math.ceil(12 / columns.xs)}`;
        }
        if (columns.sm) {
          columnClasses += ` col-sm-${Math.ceil(12 / columns.sm)}`;
        }
        if (columns.md) {
          columnClasses += ` col-md-${Math.ceil(12 / columns.md)}`;
        }
        if (columns.lg) {
          columnClasses += ` col-lg-${Math.ceil(12 / columns.lg)}`;
        }
        if (columns.xl) {
          columnClasses += ` col-xl-${Math.ceil(12 / columns.xl)}`;
        }
        const column = document.createElement('div');
        column.className = columnClasses;
        element.parentNode.insertBefore(column, element);
        column.appendChild(element);
      } else {
        console.error(
          `Columns should be defined as numbers or objects. ${typeof columns} is not supported.`
        );
      }
    },
    moveItemInRowWrapper(element) {
      const rowWrapper = document.querySelector('.gallery-items-row');
      rowWrapper.appendChild(element);
    },
    responsiveImageItem(element) {
      if (element.tagName === 'IMG') {
        element.classList.add('img-fluid');
      }
    },
    openLightBox(element, lightboxId) {
      const lightbox = document.getElementById(lightboxId);
      const lightboxImage = lightbox.querySelector('.lightboxImage');
      lightboxImage.src = element.src;
      
      // Utiliser Bootstrap pour afficher la modal
      const modal = new bootstrap.Modal(lightbox);
      modal.show();
    },
    prevImage() {
      let activeImage = null;
      const lightboxImage = document.querySelector('.lightboxImage');
      
      document.querySelectorAll('img.gallery-item').forEach(img => {
        if (img.src === lightboxImage.src) {
          activeImage = img;
        }
      });
      
      const activeTag = document.querySelector('.tags-bar span.active-tag')?.dataset.imagesToggle;
      const imagesCollection = [];
      
      if (activeTag === 'all') {
        document.querySelectorAll('.item-column').forEach(column => {
          const img = column.querySelector('img');
          if (img) {
            imagesCollection.push(img);
          }
        });
      } else {
        document.querySelectorAll('.item-column').forEach(column => {
          const img = column.querySelector('img');
          if (img && img.dataset.galleryTag === activeTag) {
            imagesCollection.push(img);
          }
        });
      }
      
      let index = 0;
      let next = null;
      
      imagesCollection.forEach((img, i) => {
        if (activeImage && activeImage.src === img.src) {
          index = i - 1;
        }
      });
      
      next = imagesCollection[index] || imagesCollection[imagesCollection.length - 1];
      
      if (next) {
        lightboxImage.src = next.src;
      }
    },
    nextImage() {
      let activeImage = null;
      const lightboxImage = document.querySelector('.lightboxImage');
      
      document.querySelectorAll('img.gallery-item').forEach(img => {
        if (img.src === lightboxImage.src) {
          activeImage = img;
        }
      });
      
      const activeTag = document.querySelector('.tags-bar span.active-tag')?.dataset.imagesToggle;
      const imagesCollection = [];
      
      if (activeTag === 'all') {
        document.querySelectorAll('.item-column').forEach(column => {
          const img = column.querySelector('img');
          if (img) {
            imagesCollection.push(img);
          }
        });
      } else {
        document.querySelectorAll('.item-column').forEach(column => {
          const img = column.querySelector('img');
          if (img && img.dataset.galleryTag === activeTag) {
            imagesCollection.push(img);
          }
        });
      }
      
      let index = 0;
      let next = null;
      
      imagesCollection.forEach((img, i) => {
        if (activeImage && activeImage.src === img.src) {
          index = i + 1;
        }
      });
      
      next = imagesCollection[index] || imagesCollection[0];
      
      if (next) {
        lightboxImage.src = next.src;
      }
    },
    createLightBox(gallery, lightboxId, navigation) {
      const lightboxDiv = document.createElement('div');
      lightboxDiv.className = 'modal fade';
      lightboxDiv.id = lightboxId ? lightboxId : "galleryLightbox";
      lightboxDiv.setAttribute('tabindex', '-1');
      lightboxDiv.setAttribute('role', 'dialog');
      lightboxDiv.setAttribute('aria-hidden', 'true');
      
      lightboxDiv.innerHTML = `
        <div class="modal-dialog" role="document">
          <div class="modal-content">
            <div class="modal-body">
              ${
                navigation
                  ? '<div class="mg-prev" style="cursor:pointer;position:absolute;top:50%;left:-15px;background:white;"><</div>'
                  : '<span style="display:none;" />'
              }
              <img class="lightboxImage img-fluid" alt="Contenu de l'image affichée dans la modale au clique"/>
              ${
                navigation
                  ? '<div class="mg-next" style="cursor:pointer;position:absolute;top:50%;right:-15px;background:white;">></div>'
                  : '<span style="display:none;" />'
              }
            </div>
          </div>
        </div>
      `;
      
      gallery.appendChild(lightboxDiv);
    },
    showItemTags(gallery, position, tags) {
      let tagItems = '<li class="nav-item"><span class="nav-link active active-tag" data-images-toggle="all">Tous</span></li>';
      
      tags.forEach((value, index) => {
        tagItems += `<li class="nav-item active">
                <span class="nav-link" data-images-toggle="${value}">${value}</span></li>`;
      });
      
      const tagsRow = document.createElement('ul');
      tagsRow.className = 'my-4 tags-bar nav nav-pills';
      tagsRow.innerHTML = tagItems;
      
      if (position === "bottom") {
        gallery.appendChild(tagsRow);
      } else if (position === "top") {
        gallery.insertBefore(tagsRow, gallery.firstChild);
      } else {
        console.error(`Unknown tags position: ${position}`);
      }
    },
    filterByTag(event) {
      const target = event.target;
      
      if (!target.classList.contains('nav-link')) {
        return;
      }
      
      if (target.classList.contains('active-tag')) {
        return;
      }
      
      const activeTag = document.querySelector('.active.active-tag');
      if (activeTag) {
        activeTag.classList.remove('active', 'active-tag');
      }
      
      target.classList.add('active-tag', 'active');
      
      const tag = target.dataset.imagesToggle;
      
      document.querySelectorAll('.gallery-item').forEach(item => {
        const column = item.closest('.item-column');
        column.style.display = 'none';
        
        if (tag === 'all') {
          column.style.display = 'block';
          setTimeout(() => {
            column.style.opacity = '1';
          }, 300);
        } else if (item.dataset.galleryTag === tag) {
          column.style.display = 'block';
          setTimeout(() => {
            column.style.opacity = '1';
          }, 300);
        }
      });
    }
  };

  // Écouteurs d'événements
  this.listeners = function(options) {
    document.querySelectorAll('.gallery-item').forEach(item => {
      item.addEventListener('click', () => {
        if (options.lightBox && item.tagName === 'IMG') {
          this.methods.openLightBox(item, options.lightboxId);
        } else {
          return;
        }
      });
    });

    document.querySelectorAll('.gallery').forEach(gallery => {
      gallery.addEventListener('click', event => {
        if (event.target.closest('.nav-link')) {
          this.methods.filterByTag(event);
        }
        
        if (event.target.closest('.mg-prev')) {
          this.methods.prevImage(options.lightboxId);
        }
        
        if (event.target.closest('.mg-next')) {
          this.methods.nextImage(options.lightboxId);
        }
      });
    });
  };

  // Initialisation
  this.init = function(selector, userOptions = {}) {
    // Fusion des options
    const options = Object.assign({}, this.defaults, userOptions);
    
    // Sélection des galeries
    document.querySelectorAll(selector).forEach(gallery => {
      const tagsCollection = [];
      
      // Crée le wrapper de ligne
      this.methods.createRowWrapper(gallery);
      
      // Crée lightbox si nécessaire
      if (options.lightBox) {
        this.methods.createLightBox(gallery, options.lightboxId, options.navigation);
      }
      
      // Ajouter les écouteurs
      this.listeners(options);
      
      // Traiter chaque élément
      gallery.querySelectorAll('.gallery-item').forEach(item => {
        this.methods.responsiveImageItem(item);
        this.methods.moveItemInRowWrapper(item);
        this.methods.wrapItemInColumn(item, options.columns);
        
        const theTag = item.dataset.galleryTag;
        if (options.showTags && theTag && tagsCollection.indexOf(theTag) === -1) {
          tagsCollection.push(theTag);
        }
      });
      
      // Afficher les tags si nécessaire
      if (options.showTags && tagsCollection.length > 0) {
        this.methods.showItemTags(gallery, options.tagsPosition, tagsCollection);
      }
      
      // Afficher la galerie avec transition
      gallery.style.display = 'block';
      gallery.style.opacity = '0';
      setTimeout(() => {
        gallery.style.transition = 'opacity 0.5s ease';
        gallery.style.opacity = '1';
      }, 0);
    });
  };
};

// Initialisation au chargement du DOM
document.addEventListener('DOMContentLoaded', () => {
  const gallery = new mauGallery();
  gallery.init('.gallery');
});
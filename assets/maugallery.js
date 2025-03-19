document.addEventListener('DOMContentLoaded', function() {
  const mauGallery = function() {
      this.defaults = {
          columns: 3,
          lightBox: true,
          lightboxId: null,
          showTags: true,
          tagsPosition: "top",
          navigation: true
      };

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
                  if (columns.xs) columnClasses += ` col-${Math.ceil(12 / columns.xs)}`;
                  if (columns.sm) columnClasses += ` col-sm-${Math.ceil(12 / columns.sm)}`;
                  if (columns.md) columnClasses += ` col-md-${Math.ceil(12 / columns.md)}`;
                  if (columns.lg) columnClasses += ` col-lg-${Math.ceil(12 / columns.lg)}`;
                  if (columns.xl) columnClasses += ` col-xl-${Math.ceil(12 / columns.xl)}`;
                  
                  const column = document.createElement('div');
                  column.className = columnClasses;
                  element.parentNode.insertBefore(column, element);
                  column.appendChild(element);
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
              
              const modal = new bootstrap.Modal(lightbox);
              modal.show();
          },
          showItemTags(gallery, position, tags) {
              let tagItems = '<li class="nav-item"><span class="nav-link active active-tag" data-images-toggle="all">Tous</span></li>';
              
              tags.forEach((value) => {
                  tagItems += `<li class="nav-item active">
                      <span class="nav-link" data-images-toggle="${value}">${value}</span></li>`;
              });
              
              const tagsRow = document.createElement('ul');
              tagsRow.className = 'my-4 tags-bar nav nav-pills';
              tagsRow.innerHTML = tagItems;
              
              if (position === "top") {
                  gallery.insertBefore(tagsRow, gallery.firstChild);
              }
          },
          filterByTag(event) {
              const target = event.target;
              
              if (!target.classList.contains('nav-link')) return;
              if (target.classList.contains('active-tag')) return;
              
              const activeTag = document.querySelector('.active.active-tag');
              if (activeTag) {
                  activeTag.classList.remove('active', 'active-tag');
              }
              
              target.classList.add('active-tag', 'active');
              
              const tag = target.dataset.imagesToggle;
              
              document.querySelectorAll('.gallery-item').forEach(item => {
                  const column = item.closest('.item-column');
                  column.style.display = 'none';
                  
                  if (tag === 'all' || item.dataset.galleryTag === tag) {
                      column.style.display = 'block';
                      setTimeout(() => {
                          column.style.opacity = '1';
                      }, 300);
                  }
              });
          }
      };

      this.init = function(selector, userOptions = {}) {
          const options = Object.assign({}, this.defaults, userOptions);
          
          document.querySelectorAll(selector).forEach(gallery => {
              const tagsCollection = [];
              
              this.methods.createRowWrapper(gallery);
              
              gallery.addEventListener('click', event => {
                  if (event.target.closest('.nav-link')) {
                      this.methods.filterByTag(event);
                  }
              });
              
              gallery.querySelectorAll('.gallery-item').forEach(item => {
                  this.methods.responsiveImageItem(item);
                  this.methods.moveItemInRowWrapper(item);
                  this.methods.wrapItemInColumn(item, options.columns);
                  
                  const theTag = item.dataset.galleryTag;
                  if (options.showTags && theTag && !tagsCollection.includes(theTag)) {
                      tagsCollection.push(theTag);
                  }
              });
              
              if (options.showTags && tagsCollection.length > 0) {
                  this.methods.showItemTags(gallery, options.tagsPosition, tagsCollection);
              }
              
              gallery.style.display = 'block';
              gallery.style.opacity = '0';
              setTimeout(() => {
                  gallery.style.transition = 'opacity 0.5s ease';
                  gallery.style.opacity = '1';
              }, 0);
          });
      };
  };

  const gallery = new mauGallery();
  gallery.init('.gallery', {
      columns: {
          xs: 1,
          sm: 2, 
          md: 3,
          lg: 3,
          xl: 3
      },
      lightBox: true,
      lightboxId: 'myAwesomeLightbox',
      showTags: true,
      tagsPosition: 'top'
  });
});
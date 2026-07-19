(function($) {

  "use strict";

  // init Chocolat light box
	var initChocolat = function() {
		Chocolat(document.querySelectorAll('.image-link'), {
		  imageSize: 'contain',
		  loop: true,
		})
	}

  var initSwiper = function() {

    new Swiper(".main-swiper", {
      speed: 500,
      loop: true,
      autoplay: {
        delay: 5000,
        disableOnInteraction: false,
        pauseOnMouseEnter: true,
      },
      keyboard: {
        enabled: true,
      },
      pagination: {
        el: ".swiper-pagination",
        clickable: true,
      },
    });

    new Swiper(".category-carousel", {
      slidesPerView: 6,
      spaceBetween: 30,
      speed: 500,
      keyboard: {
        enabled: true,
      },
      navigation: {
        nextEl: ".category-carousel-next",
        prevEl: ".category-carousel-prev",
      },
      breakpoints: {
        0: {
          slidesPerView: 2,
        },
        768: {
          slidesPerView: 3,
        },
        991: {
          slidesPerView: 4,
        },
        1500: {
          slidesPerView: 6,
        },
      }
    });

    new Swiper(".brand-carousel", {
      slidesPerView: 4,
      spaceBetween: 30,
      speed: 500,
      loop: true,
      autoplay: {
        delay: 4000,
        disableOnInteraction: false,
        pauseOnMouseEnter: true,
      },
      keyboard: {
        enabled: true,
      },
      navigation: {
        nextEl: ".brand-carousel-next",
        prevEl: ".brand-carousel-prev",
      },
      breakpoints: {
        0: {
          slidesPerView: 2,
        },
        768: {
          slidesPerView: 2,
        },
        991: {
          slidesPerView: 3,
        },
        1500: {
          slidesPerView: 4,
        },
      }
    });

    document.querySelectorAll(".products-carousel").forEach(function(carousel) {
      var section = carousel.closest("section");
      new Swiper(carousel, {
        slidesPerView: 5,
        spaceBetween: 20,
        speed: 500,
        keyboard: {
          enabled: true,
        },
        navigation: {
          nextEl: section ? section.querySelector(".products-carousel-next") : null,
          prevEl: section ? section.querySelector(".products-carousel-prev") : null,
        },
        breakpoints: {
          0: {
            slidesPerView: 1.15,
          },
          576: {
            slidesPerView: 2,
          },
          768: {
            slidesPerView: 3,
          },
          1100: {
            slidesPerView: 4,
          },
          1400: {
            slidesPerView: 5,
          },
        }
      });
    });
  }

  var initProductQty = function(){

    $('.product-qty').each(function(){

      var $el_product = $(this);
      var quantity = 0;

      $el_product.find('.quantity-right-plus').click(function(e){
          e.preventDefault();
          var quantity = parseInt($el_product.find('#quantity').val());
          $el_product.find('#quantity').val(quantity + 1);
      });

      $el_product.find('.quantity-left-minus').click(function(e){
          e.preventDefault();
          var quantity = parseInt($el_product.find('#quantity').val());
          if(quantity>0){
            $el_product.find('#quantity').val(quantity - 1);
          }
      });

    });

  }

  var initApnaCart = function() {
    var storageKey = 'apnamart-cart-items';
    var $items = $('#cartItems');
    var $empty = $('#cartEmpty');
    var $footer = $('#cartFooter');

    var readCart = function() {
      try {
        var saved = JSON.parse(localStorage.getItem(storageKey) || '[]');
        return Array.isArray(saved) ? saved : [];
      } catch (error) {
        return [];
      }
    };

    var writeCart = function(cart) {
      try {
        localStorage.setItem(storageKey, JSON.stringify(cart));
        localStorage.setItem('apnamart-cart', String(cart.reduce(function(total, item) {
          return total + item.quantity;
        }, 0)));
      } catch (error) {}
    };

    var formatMoney = function(value) {
      return '₹' + Math.round(value).toLocaleString('en-IN');
    };

    var escapeHtml = function(value) {
      return $('<div>').text(value).html();
    };

    var renderCart = function() {
      var cart = readCart();
      var count = cart.reduce(function(total, item) { return total + item.quantity; }, 0);
      var total = cart.reduce(function(sum, item) { return sum + (item.price * item.quantity); }, 0);

      $items.html(cart.map(function(item, index) {
        return '<article class="apna-cart-item" data-cart-index="' + index + '">' +
          '<div class="apna-cart-thumb"><img src="' + escapeHtml(item.image) + '" alt=""></div>' +
          '<div class="apna-cart-item-copy"><h3>' + escapeHtml(item.name) + '</h3>' +
          '<small>Fresh pick · quality guaranteed</small>' +
          '<div class="apna-cart-item-bottom"><div class="apna-cart-qty">' +
          '<button type="button" data-cart-action="minus" aria-label="Reduce quantity">−</button>' +
          '<span>' + item.quantity + '</span>' +
          '<button type="button" data-cart-action="plus" aria-label="Increase quantity">+</button></div>' +
          '<strong>' + formatMoney(item.price * item.quantity) + '</strong></div></div>' +
          '<button class="apna-cart-remove" type="button" data-cart-action="remove" aria-label="Remove ' + escapeHtml(item.name) + '">×</button></article>';
      }).join(''));

      $empty.toggle(cart.length === 0);
      $footer.toggle(cart.length > 0);
      $('#cartGrandTotal').text(formatMoney(total));
      $('.cart-total').text(formatMoney(total));
      $('.apna-header-cart-count').text(count);
      $('[data-cart-count]').text(count);
      $('.apna-cart-progress span').css('width', Math.min((total / 499) * 100, 100) + '%');
      $('.apna-cart-progress p').html(total >= 499 ? '<strong>You unlocked free delivery!</strong>' : 'Add ' + formatMoney(499 - total) + ' for <strong>free delivery</strong>');
    };

    $(document).on('click', '.product-item .nav-link', function(event) {
      if ($(this).text().trim().indexOf('Add to Cart') !== 0) return;
      event.preventDefault();
      var $product = $(this).closest('.product-item');
      var name = $product.find('h3').first().text().trim() || 'ApnaMart product';
      var image = $product.find('img').first().attr('src') || 'assets/images/apnamart-thumb-bananas.png';
      var rawPrice = parseFloat(($product.find('.price').first().text().match(/[\d.]+/) || ['18'])[0]);
      var price = rawPrice < 50 ? Math.round(rawPrice * 10) : Math.round(rawPrice);
      var quantity = parseInt($product.find('.input-number').first().val(), 10) || 1;
      var id = (name + image).toLowerCase().replace(/[^a-z0-9]+/g, '-');
      var cart = readCart();
      var existing = cart.find(function(item) { return item.id === id; });
      if (existing) existing.quantity += quantity;
      else cart.push({ id: id, name: name, image: image, price: price, quantity: quantity });
      writeCart(cart);
      renderCart();
      $(this).addClass('added').html('Added ✓');
      var button = this;
      setTimeout(function() { $(button).removeClass('added').html('Add to Cart <iconify-icon icon="uil:shopping-cart"></iconify-icon>'); }, 1400);
      var drawer = document.getElementById('offcanvasCart');
      if (drawer && window.bootstrap) bootstrap.Offcanvas.getOrCreateInstance(drawer).show();
    });

    $items.on('click', '[data-cart-action]', function() {
      var index = Number($(this).closest('[data-cart-index]').data('cart-index'));
      var action = $(this).data('cart-action');
      var cart = readCart();
      if (!cart[index]) return;
      if (action === 'plus') cart[index].quantity += 1;
      if (action === 'minus') cart[index].quantity = Math.max(1, cart[index].quantity - 1);
      if (action === 'remove') cart.splice(index, 1);
      writeCart(cart);
      renderCart();
    });

    $(document).on('click', '.btn-wishlist', function(event) {
      event.preventDefault();
      $(this).toggleClass('active').attr('aria-pressed', String($(this).hasClass('active')));
    });

    renderCart();
  };

  var initPageRoutes = function() {
    $('.section-header .btn-link').attr('href', '#category-section');
    $('#latest-blog a[href="#"]').attr('href', 'journals.html');
    $('.apna-login-link').attr('href', 'support.html');
    $('header a:has(use[xlink\\:href="#user"])').attr('href', 'support.html');
    $('header a:has(use[xlink\\:href="#heart"])').attr('href', 'product-details.html');
    $('.banner-ad .btn[href="#"]').attr('href', 'product-details.html');
    $('a.btn-warning[href="#"]').attr('href', '#trending-products');
  };

  var initProductFilter = function() {
    var $form = $('[data-product-filter]');
    if (!$form.length) return;
    var applyFilter = function() {
      var query = String($form.find('[data-filter-query]').val() || '').trim().toLowerCase();
      var category = $form.find('[data-filter-category]').val() || 'all';
      var maxPrice = Number($form.find('[data-filter-price]').val()) || Infinity;
      var targetTab = category === 'fruits' ? '#nav-fruits-tab' : category === 'juices' ? '#nav-juices-tab' : '#nav-all-tab';
      var tabButton = document.querySelector(targetTab);
      if (tabButton && window.bootstrap) bootstrap.Tab.getOrCreateInstance(tabButton).show();
      var $targetGrid = category === 'fruits' ? $('#nav-fruits .product-grid') : category === 'juices' ? $('#nav-juices .product-grid') : $('#nav-all .product-grid');
      var visible = 0;
      $('#trending-products .product-grid > .col').hide();
      $targetGrid.children('.col').each(function(index) {
        var $item = $(this);
        var name = $item.find('h3').text().trim().toLowerCase();
        var price = Number(($item.find('.price').text().match(/[\d.]+/) || ['0'])[0]);
        var matches = (!query || name.indexOf(query) !== -1) && price <= maxPrice && visible < 5;
        $item.toggle(matches);
        if (matches) visible++;
      });
      $form.find('[data-filter-status]').text(visible ? visible + ' products found' : 'No matching products');
      document.querySelector('#trending-products').scrollIntoView({ behavior: 'smooth', block: 'start' });
    };
    $form.on('submit', function(event) { event.preventDefault(); applyFilter(); });
    $form.on('reset', function() {
      setTimeout(function() {
        $('#trending-products .product-grid > .col').removeAttr('style');
        var allTab = document.querySelector('#nav-all-tab');
        if (allTab && window.bootstrap) bootstrap.Tab.getOrCreateInstance(allTab).show();
        $form.find('[data-filter-status]').text('Filters cleared');
      }, 0);
    });
  };

  // init jarallax parallax
  var initJarallax = function() {
    jarallax(document.querySelectorAll(".jarallax"));

    jarallax(document.querySelectorAll(".jarallax-keep-img"), {
      keepImg: true,
    });
  }

  // document ready
  $(document).ready(function() {
    
    initSwiper();
    initProductQty();
    initApnaCart();
    initPageRoutes();
    initProductFilter();
    initJarallax();
    initChocolat();

  }); // End of a document

})(jQuery);

$(document).ready(function() {

  // Product data to be used in shop and in cart
  var products = {
    'Apple Watch' : ['Apple Watch', "The Apple Watch is a smartwatch developed by Apple Inc.", 199, 'http://blogs-images.forbes.com/anthonykosner/files/2014/10/apple-watch-selling-points.jpg', 1],
    'Macbook' : ['Macbook', "The MacBook is a brand of notebook computers manufactured by Apple Inc. from early 2006 to late 2011, and relaunched in 2015.", 1200, 'http://cnet3.cbsistatic.com/hub/i/r/2015/04/07/443d8973-f1fb-4ebb-b63e-0dd9150745fc/thumbnail/770x433/bb7b99f2a8dc4f6e40d25a1ff90d56e3/macbook-air-gold-2015-03.jpg', 2],  
    'Alienware' : ['Alienware', "Alienware is an American computer hardware subsidiary of Dell, Inc. Their products are designed for gaming and can be identified by their science-fiction-themed designs.", 1600, 'http://image.alienware.com/images/homepage_eye/2016-01/alienware-laptops-nvidia-graphics-2016-active.jpg', 3],
    'Moto 360' : ['Moto 360', "The Moto 360 (2nd generation), also known as the Moto 360 (2015), is an Android Wear-based smartwatch.", 225, 'http://o.aolcdn.com/hss/storage/midas/7e32d3e6a31385cd3d94bc9b1d3fea8d/202774219/Moto+360+lead.jpg', 4],
    'Beats Solo 2' : ['Beats Solo 2', "The company was formally established in 2006, a time when Iovine perceived two key problems in the music industry.", 189, 'http://www.ammunitiongroup.com/wp-content/uploads/2014/06/Ammunition_Work_BeatsSolo2_Hero_interior_21-wpcf_1024x576.jpg', 5],
    'iphone 6' : ['iphone 6', "The iPhone 6 and iPhone 6 Plus are smartphones designed and marketed by Apple Inc.", 625, 'http://cdn2.macworld.co.uk/cmsdata/reviews/3534761/iPhone_6_MG_1953.jpg', 6]
  };  
  
  // Populates shop with items based on template and data in var products
  
  var $shop = $('.shop');
  var $cart = $('.cart-items');
  
  for(var item in products) {
    var itemName = products[item][0],
        itemDescription = products[item][1],
        itemPrice = products[item][2],
        itemImg = products[item][3],
        itemId = products[item][4],
        $template = $($('#productTemplate').html());
    
    $template.find('h1').text(itemName);
    $template.find('p').text(itemDescription);
    $template.find('.price').text('$' + itemPrice);
    $template.css('background-image', 'url(' + itemImg + ')');
    
    $template.data('id', itemId);
    $template.data('name', itemName);
    $template.data('price', itemPrice);
    $template.data('image', itemImg);
    
    $shop.append($template);
  }
  
  // Checks quantity of a cart item on input blur and updates total
  // If quantity is zero, item is removed
  
  $('body').on('blur', '.cart-items input', function() {
    var $this = $(this),
        $item = $this.parents('li');
    if (+$this.val() === 0) {
      $item.remove();
    } else {
      calculateSubtotal($item);
    }
    updateCartQuantity();
    calculateAndUpdate();
  });
  
  // Add item from the shop to the cart
  // If item is already in the cart, +1 to quantity
  // If not, creates the cart item based on template
  
  $('body').on('click', '.product .add', function() {
    var items = $cart.children(),
        $item = $(this).parents('.product'),
        $template = $($('#cartItem').html()),
        $matched = null,
        quantity = 0;
    
    $matched = items.filter(function(index) {
      var $this = $(this);
      return $this.data('id') === $item.data('id');
    });
   
    if ($matched.length) {
      quantity = +$matched.find('.quantity').val() + 1;
      $matched.find('.quantity').val(quantity);
      calculateSubtotal($matched);
    } else {
      $template.find('.cart-product').css('background-image', 'url(' + $item.data('image') + ')');
      $template.find('h3').text($item.data('name'));
      $template.find('.subtotal').text('$' + $item.data('price'));
    
      $template.data('id', $item.data('id'));
      $template.data('price', $item.data('price'));
      $template.data('subtotal', $item.data('price'));
      
      $cart.append($template);
    }
    
    updateCartQuantity();
    calculateAndUpdate();
  });

  // Calculates subtotal for an item
  
  function calculateSubtotal($item) {
    var quantity = $item.find('.quantity').val(),
        price = $item.data('price'),
        subtotal = quantity * price;
    $item.find('.subtotal').text('$' + subtotal);
    $item.data('subtotal', subtotal);
  } 
    
  // Clicking on the cart link opens up the shopping cart
  
  var $cartlink = $('.cart-link'), $wrap = $('#wrap');
  
  $cartlink.on('click', function() {
    $cartlink.toggleClass('active');
    $wrap.toggleClass('active');
    return false;    
	});
  
  // Clicking outside the cart closes the cart, unless target is the "Add to Cart" button 
 
  $wrap.on('click', function(e){
    if (!$(e.target).is('.add')) {
      $wrap.removeClass('active');
      $cartlink.removeClass('active');
    }
  });
 
  // Calculates and updates totals, taxes, shipping
  
  function calculateAndUpdate() {
    var subtotal = 0,
        items = $cart.children(),
        // shipping not applied if there are no items
        shipping = items.length > 0 ? 5 : 0,
        tax = 0;
    items.each(function(index, item) {
      var $item = $(item),
          price = $item.data('subtotal');
      subtotal += price;
    });
    $('.subtotalTotal span').text(formatDollar(subtotal));
    tax = subtotal * .05;
    $('.taxes span').text(formatDollar(tax));
    $('.shipping span').text(formatDollar(shipping));
    $('.finalTotal span').text(formatDollar(subtotal + tax + shipping));
  }

  //  Update the total quantity of items in notification, hides if zero
  
  function updateCartQuantity() {
    var quantities = 0,
        $cartQuantity = $('span.cart-quantity'),
        items = $cart.children();
    items.each(function(index, item) {
      var $item = $(item),
          quantity = +$item.find('.quantity').val();
      quantities += quantity;
    });
    if(quantities > 0){
      $cartQuantity.removeClass('empty');
    } else {
      $cartQuantity.addClass('empty');
    }
    $cartQuantity.text(quantities);
  }
  
 
  //  Formats number into dollar format
     
  function formatDollar(amount) {
    return '$' + parseFloat(Math.round(amount * 100) / 100).toFixed(2);
  }
  
  // Restrict the quantity input field to numbers only
     
  $('body').on('keypress', '.cart-items input', function (ev) {
      var keyCode = window.event ? ev.keyCode : ev.which;
      if (keyCode < 48 || keyCode > 57) {
        if (keyCode != 0 && keyCode != 8 && keyCode != 13 && !ev.ctrlKey) {
          ev.preventDefault();
        }
      }
    });
  
  // Trigger animation on Add to Cart button click
  
  $('.addtocart').on('click', function () {
    $(this).addClass('active');
    setTimeout(function () {
      $('.addtocart').removeClass('active');    
    }, 1000);
  });
  
  // Trigger error animation on Checkout button
  
  $('.checkout').on('click', function () {
    $(this).addClass('active');
    $('.error').css('display', 'block');
    setTimeout(function () {
      $('.checkout').removeClass('active');    
      $('.error').css('display', 'none');      
    }, 1000);
  });    
  
});
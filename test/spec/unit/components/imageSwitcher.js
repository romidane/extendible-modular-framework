
describe('UNIT.WASP.ImageSwitch', function() {
	var switcher, sandbox,img;
	//Create an instance of sanbox
	before(function(){
		sandbox = App._createSanbox('image');
	});

	
	beforeEach(function(){
		//Create a new instance
		switcher = Object.create(ImageSwitcher(sandbox));
		//Create temp default Elements
		img = document.createElement('img');
		img.src = "blue.jpg";
		switcher.view.collectionHolder = document.createElement('ul');
		switcher.view.currPos = document.createElement('DIV');
		switcher.view.mainImg = img;

		//Reset current postion
		switcher.controller.currentImgPos = 0;
	});	

	describe('Controller', function(){


		describe('#updateCurrPost', function() {
			it('should update the current position', function(){
				expect(switcher.controller.currentImgPos).to.equal(0);
				switcher.controller.updateCurrPos(2, [1,3,5].length);
				expect(switcher.controller.currentImgPos).to.equal(2);
				switcher.controller.updateCurrPos(-1, [1,3,5,7].length);
				expect(switcher.controller.currentImgPos).to.equal(3);
			});
		});


		describe('#getIndex', function() {
			it('should retrive the index from a collection', function(){
				var collection = ['a','b','c','d','e'];
				var target = 'c';
				expect(switcher.controller.getIndex(collection, target)).to.equal(2);
			});
		});



		describe('#getImageData', function() {
			it('it should return the data in the img attribute', function(){
				var thumb = document.createElement('img');
				thumb.setAttribute('data-thumb-large', 'cheese.jpg');
				
				var imgdata = switcher.controller.getImageData(thumb);

				expect(imgdata).to.equal('cheese.jpg');
			});
		});

		
		describe('#UpdateMainImg', function(){
			it('should be update the main img src', function(){
				var thumbImg = document.createElement('img');
				thumbImg.setAttribute('data-thumb-large', 'cheese.jpg');
				switcher.bindings();
				switcher.controller.updateMainImg(thumbImg);
				expect(switcher.view.mainImg.src.indexOf('cheese.jpg')).to.be.above(-1);
			});
		});


		describe('#respondToDirectionChange', function() {
			var imgCollection = [], i;
			
			before(function(){
				//create collection of imgs
				for(i = 0; i < 3; i++) {
					var thumb = document.createElement('img');
					thumb.setAttribute('data-thumb-large', 'image'+ i +'.jpg');
					imgCollection.push(thumb);
				}
			});

			it('should update the main img', function(){

				switcher.bindings();

				switcher.controller.respondToDirectionChange({
					swipeValue: 1,
					collection: imgCollection
				});
				expect(switcher.controller.currentImgPos).to.equal(1);
				expect(switcher.view.mainImg.src.indexOf('image1')).to.be.above(-1);

				switcher.controller.respondToDirectionChange({
					swipeValue: -1,
					collection: imgCollection
				});

				expect(switcher.controller.currentImgPos).to.equal(0);
				expect(switcher.view.mainImg.src.indexOf('image0')).to.be.above(-1);

			});
		});


		describe('#respondToThumbClick', function() {
			var imgCollection = [], i;
			before(function(){
				//create collection of imgs
				for(i = 0; i < 3; i++) {
					var thumb = document.createElement('img');
					thumb.setAttribute('data-thumb-large', 'image'+ i +'.jpg');
					imgCollection.push(thumb);
				}
			});

			it('should update the main img', function(){
				switcher.bindings();
				switcher.controller.respondToThumbClick({
					thumb: imgCollection[2],
					collection: imgCollection
				});

				expect(switcher.controller.currentImgPos).to.equal(2);
				expect(switcher.view.mainImg.src.indexOf('image2')).to.be.above(-1);
			});
		});

	});


	describe('View', function() {
		var  thumbCollection = [];

		before(function(){
			for(var i = 0; i < 3; i++) {
				var thumb = document.createElement('img');
				thumb.setAttribute('data-thumb-large', 'image'+ i +'.jpg');
				thumbCollection.push(thumb);
			}
		});
		
		describe('#updateMainImg', function() {
			it('should update the main image', function(){
				var data = { newImg: "someImg.jpg", position: 2 };
				expect( switcher.view.mainImg.getAttributeNode('src').nodeValue ).to.equal('blue.jpg');
				switcher.view.updateMainImg(data);
				expect( switcher.view.mainImg.getAttributeNode('src').nodeValue ).to.equal('someImg.jpg');
			});
		});

		describe('#updateSlidPos', function() {
			it('should update the main image', function(){
				switcher.view.imgs = thumbCollection;
				var data = { position: 2 };
				switcher.view.updateSlidPos(data);
				expect(switcher.view.currPos.innerHTML).to.equal("3 / 3");
			});
		});

	});


});

describe('INTEGRATION.WASP.ImageSwitch', function() {

	var testSandbox, secondThumbnailElement, slider;

	before(function(){
		testSandbox = document.getElementById('img-switcher');
		secondThumbnailElement = document.getElementById('second-thumb');
		slider = Core.create('img-switcher',ImageSwitcher);
		Core.start('img-switcher');
	});

	describe('When a thumbnail is clicked', function(){
		it('Replaces the main image with the one in the thumb', function(){

			var thumbs = document.querySelectorAll('.thumbnails img');
			expect(document.getElementById('main-image').src.indexOf('black.png')).to.be.above(-1);
			expect(slider.controller.currentImgPos).to.equal(0);
			//click img
			thumbs[1].click();

			expect( /black2\./.test(document.getElementById('main-image').src) ).to.be.true;
			expect(slider.controller.currentImgPos).to.equal(1);

			//click again
			thumbs[0].click();

			expect( /black\./.test(document.getElementById('main-image').src) ).to.be.true;
			expect(slider.controller.currentImgPos).to.equal(0);
		
		});
	});

});

describe('settings', function() {
  describe('renderer', function() {
    var id = 'testContainer';

    beforeEach(function() {
      this.$container = $('<div id="' + id + '"></div>').appendTo('body');
    });

    afterEach(function() {
      if (this.$container) {
        destroy();
        this.$container.remove();
      }
    });

    describe('defined in constructor', function() {
      it('should use text renderer by default', function() {
        var originalTextRenderer = Handsontable.cellTypes.text.renderer;

        spyOn(Handsontable.cellTypes.text, 'renderer');
        Handsontable.renderers.registerRenderer('text', Handsontable.cellTypes.text.renderer);

        handsontable();
        expect(Handsontable.cellTypes.text.renderer).toHaveBeenCalled();

        Handsontable.renderers.registerRenderer('text', originalTextRenderer);
      });

      it('should use renderer from predefined string', function() {
        var originalTextRenderer = Handsontable.renderers.TextRenderer;
        spyOn(Handsontable.renderers, 'TextRenderer');
        Handsontable.renderers.registerRenderer('text', Handsontable.renderers.TextRenderer);

        var originalCheckboxRenderer = Handsontable.renderers.CheckboxRenderer;
        spyOn(Handsontable.renderers, 'CheckboxRenderer');
        Handsontable.renderers.registerRenderer('checkbox', Handsontable.renderers.CheckboxRenderer);

        handsontable({
          columns: [
            {
              renderer: 'checkbox'
            }
          ]
        });
        expect(Handsontable.renderers.TextRenderer).not.toHaveBeenCalled();
        expect(Handsontable.renderers.CheckboxRenderer).toHaveBeenCalled();

        Handsontable.renderers.registerRenderer('text', originalTextRenderer);
        Handsontable.renderers.registerRenderer('checkbox', originalCheckboxRenderer);
      });

      it('should use renderer from predefined string when columns is a function', function() {
        var originalTextRenderer = Handsontable.renderers.TextRenderer;

        spyOn(Handsontable.renderers, 'TextRenderer');
        Handsontable.renderers.registerRenderer('text', Handsontable.renderers.TextRenderer);

        var originalCheckboxRenderer = Handsontable.renderers.CheckboxRenderer;
        spyOn(Handsontable.renderers, 'CheckboxRenderer');
        Handsontable.renderers.registerRenderer('checkbox', Handsontable.renderers.CheckboxRenderer);

        handsontable({
          columns: function(column) {
            return column === 0 ? {renderer: 'checkbox'} : null;
          }
        });
        expect(Handsontable.renderers.TextRenderer).not.toHaveBeenCalled();
        expect(Handsontable.renderers.CheckboxRenderer).toHaveBeenCalled();

        Handsontable.renderers.registerRenderer('text', originalTextRenderer);
        Handsontable.renderers.registerRenderer('checkbox', originalCheckboxRenderer);
      });

      it('should use renderer from custom function', function() {
        var called = false;

        function myRenderer() {
          called = true;
        }

        handsontable({
          columns: [
            {
              renderer: myRenderer
            }
          ]
        });

        expect(called).toBe(true);
      });

      it('should use renderer from custom function when columns is a function', function() {
        var called = false;

        function myRenderer() {
          called = true;
        }

        handsontable({
          columns: function(column) {
            return column === 0 ? {renderer: myRenderer} : null;
          }
        });

        expect(called).toBe(true);
      });

      it('should use renderer from custom string', function() {
        var myRenderer = jasmine.createSpy('myRenderer');

        Handsontable.renderers.registerRenderer('myRenderer', myRenderer);

        handsontable({
          columns: [
            {
              renderer: 'myRenderer'
            }
          ]
        });

        expect(myRenderer).toHaveBeenCalled();
      });

      it('should use renderer from custom string when columns is a function', function() {
        var myRenderer = jasmine.createSpy('myRenderer');

        Handsontable.renderers.registerRenderer('myRenderer', myRenderer);

        handsontable({
          columns: function(column) {
            return column === 0 ? {renderer: 'myRenderer'} : null;
          }
        });

        expect(myRenderer).toHaveBeenCalled();
      });
    });

    it('should call renderer with cellProperties.row, cellProperties.col matching row and col arguments', function() {
      var rendererSpy = jasmine.createSpy('rendererSpy').and.callThrough();
      var cellPropertiesCache = [];

      rendererSpy.and.callFake(function(instance, TD, row, col, prop, value, cellProperties) {
        cellPropertiesCache.push({
          row: cellProperties.row,
          col: cellProperties.col
        });
      });

      handsontable({
        renderer: rendererSpy
      });

      for (var i = 0, len = rendererSpy.calls.count(); i < len; i++) {
        var args = rendererSpy.calls.argsFor(i);
        var row = args[2];
        var col = args[3];
        var cellProperties = cellPropertiesCache[i];

        expect(row).toEqual(cellProperties.row);
        expect(col).toEqual(cellProperties.col);
      }
    });

    it('should call cells function before passing cellProperties to renderer', function() {
      var rendererSpy = jasmine.createSpy('rendererSpy').and.callThrough();
      var cellPropertiesCache = [];

      rendererSpy.and.callFake(function(instance, TD, row, col, prop, value, cellProperties) {
        cellPropertiesCache.push({
          cellsRow: cellProperties.cellsRow,
          cellsCol: cellProperties.cellsCol
        });
      });

      handsontable({
        renderer: rendererSpy,
        cells: function(row, col) {
          return {
            cellsRow: row,
            cellsCol: col
          };
        }
      });

      for (var i = 0, len = rendererSpy.calls.count(); i < len; i++) {
        var args = rendererSpy.calls.argsFor(i);
        var row = args[2];
        var col = args[3];
        var cellProperties = cellPropertiesCache[i];

        expect(row).toEqual(cellProperties.cellsRow);
        expect(col).toEqual(cellProperties.cellsCol);
      }
    });
  });
});
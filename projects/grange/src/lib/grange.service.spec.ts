import { TestBed } from '@angular/core/testing';

import { Grange } from './grange.service';

describe('Grange', () => {
    beforeEach(() => TestBed.configureTestingModule({}));

    it('should be created', () => {
        const service: Grange = TestBed.get(Grange);
        expect(service).toBeTruthy();
    });
});

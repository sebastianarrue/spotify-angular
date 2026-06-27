import { TestBed } from '@angular/core/testing';
import { SongCardComponent } from './song-card.component';

describe('SongCardComponent', () => {
  const mockSong = {
    _id: '123',
    title: 'Test Song',
    album: 'Test Album',
    author: 'Test Author',
    imageUrl: 'test-image.jpg',
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SongCardComponent],
    }).compileComponents();
  });

  it('should create', () => {
    const fixture = TestBed.createComponent(SongCardComponent);
    expect(fixture.componentInstance).toBeTruthy();
  });

  /* it('should compute imageUrl', () => {
    const fixture = TestBed.createComponent(SongCardComponent);
    fixture.componentRef.setInput('song', mockSong);
    expect(fixture.componentInstance.imageUrl).toBe('http://localhost:8080/images/test-image.jpg');
  }); */

  it('should emit addToPlaylist', () => {
    const fixture = TestBed.createComponent(SongCardComponent);
    fixture.componentRef.setInput('song', mockSong);
    const spy = vi.spyOn(fixture.componentInstance.addToPlaylist, 'emit');
    fixture.componentInstance.addToPlaylist.emit(mockSong);
    expect(spy).toHaveBeenCalledWith(mockSong);
  });

  it('should emit delete with song _id', () => {
    const fixture = TestBed.createComponent(SongCardComponent);
    fixture.componentRef.setInput('song', mockSong);
    const spy = vi.spyOn(fixture.componentInstance.delete, 'emit');
    fixture.componentInstance.delete.emit(mockSong._id);
    expect(spy).toHaveBeenCalledWith('123');
  });
});

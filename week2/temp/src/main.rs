use parity_scale_codec::{Encode, HasCompact};

#[derive(Encode)]
struct AsCompact<T: HasCompact>(#[codec(compact)] T);

fn main() {
    // println!("{:02x?}", 69u8.encode());
    // println!("{:02x?}", 69u32.encode());
    // println!("{:02x?}", AsCompact(69u8).encode());
    // println!("{:02x?}", AsCompact(69u32).encode());

    // println!("{:02x?}", 42u16.encode());
    // println!("{:02x?}", 16777215u32.encode());
    // println!("{:02x?}", AsCompact(16777215u32).encode());

    let thing = [2u8; 100_000].to_vec();
    for i in 0..100 {
        println!("{:02x?}", thing.encode()[i]);
    }

}
